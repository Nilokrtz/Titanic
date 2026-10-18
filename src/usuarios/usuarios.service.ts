import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { SenhasService } from '../auth/senhas.service.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { ListarUsuariosDto } from './dto/listar-usuarios.dto.js';
import { ListarUsuariosRespostaDto } from './dto/listar-usuarios-resposta.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { UsuarioRespostaDto } from './dto/usuario-resposta.dto.js';
import { UsuariosRepository } from './usuarios.repository.js';

@Injectable()
export class UsuariosService {
  constructor(
    private readonly repository: UsuariosRepository,
    private readonly senhasService: SenhasService,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<UsuarioRespostaDto> {
    const perfil = await this.repository.buscarPerfil(createUsuarioDto.perfil_id);

    if (!perfil) {
      throw new NotFoundException('Perfil não encontrado.');
    }

    const email = createUsuarioDto.email.trim().toLowerCase();
    const hashSenha = await this.senhasService.gerarHash(createUsuarioDto.senha);

    try {
      const usuario = await this.repository.criar(email, hashSenha, perfil.id);

      return {
        id: usuario.id,
        email: usuario.email,
        perfil: usuario.perfis?.nome ?? null,
      };
    } catch (erro) {
      if (
        erro instanceof Prisma.PrismaClientKnownRequestError &&
        erro.code === 'P2002'
      ) {
        throw new ConflictException('Email já cadastrado.');
      }

      throw erro;
    }
  }

  async findAll(
    filtros: ListarUsuariosDto,
    usuarioId: number,
  ): Promise<ListarUsuariosRespostaDto> {
    const usuarioAutenticado = await this.repository.buscarUsuario(usuarioId);

    if (!usuarioAutenticado || usuarioAutenticado.excluido_em) {
      throw new UnauthorizedException('Sessão inválida.');
    }

    if (usuarioAutenticado.perfis?.nome !== 'ADMIN_PROFESSOR') {
      throw new ForbiddenException('Apenas o professor pode listar usuários.');
    }

    const { usuarios, total } = await this.repository.listar(filtros);

    return {
      items: usuarios.map((usuario) => ({
        id: usuario.id,
        email: usuario.email,
        perfil: usuario.perfis?.nome ?? null,
      })),
      page: filtros.page,
      limit: filtros.limit,
      total,
    };
  }

  async findOne(id: number, usuarioId: number): Promise<UsuarioRespostaDto> {
    const usuarioAutenticado = await this.repository.buscarUsuario(usuarioId);

    if (!usuarioAutenticado || usuarioAutenticado.excluido_em) {
      throw new UnauthorizedException('Sessão inválida.');
    }

    if (
      id !== usuarioId &&
      usuarioAutenticado.perfis?.nome !== 'ADMIN_PROFESSOR'
    ) {
      throw new ForbiddenException('Sem permissão para consultar este usuário.');
    }

    const usuario = await this.repository.buscarUsuario(id);

    if (!usuario || usuario.excluido_em) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return {
      id: usuario.id,
      email: usuario.email,
      perfil: usuario.perfis?.nome ?? null,
    };
  }

  async update(
    id: number,
    atualizacao: UpdateUsuarioDto,
  ): Promise<UsuarioRespostaDto> {
    const usuarioExistente = await this.repository.buscarUsuario(id);

    if (!usuarioExistente || usuarioExistente.excluido_em) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const perfil = await this.repository.buscarPerfil(atualizacao.perfil_id);

    if (!perfil) {
      throw new NotFoundException('Perfil não encontrado.');
    }

    const dadosAtualizacao: Prisma.usuariosUpdateInput = {
      email: atualizacao.email.trim().toLowerCase(),
      perfis: { connect: { id: perfil.id } },
    };

    if (atualizacao.senha) {
      dadosAtualizacao.senha = await this.senhasService.gerarHash(
        atualizacao.senha,
      );
      dadosAtualizacao.refresh_token_hash = null;
    }

    try {
      const usuario = await this.repository.atualizar(id, dadosAtualizacao);

      return {
        id: usuario.id,
        email: usuario.email,
        perfil: usuario.perfis?.nome ?? null,
      };
    } catch (erro) {
      if (
        erro instanceof Prisma.PrismaClientKnownRequestError &&
        erro.code === 'P2002'
      ) {
        throw new ConflictException('Email já cadastrado.');
      }

      throw erro;
    }
  }

  async remove(id: number): Promise<void> {
    const exclusao = await this.repository.excluir(id);

    if (exclusao.count === 0) {
      throw new NotFoundException('Usuário não encontrado.');
    }
  }
}
