import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { SenhasService } from '../auth/senhas.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { ListarUsuariosDto } from './dto/listar-usuarios.dto.js';
import { ListarUsuariosRespostaDto } from './dto/listar-usuarios-resposta.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { UsuarioRespostaDto } from './dto/usuario-resposta.dto.js';

@Injectable()
export class UsuariosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly senhasService: SenhasService,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<UsuarioRespostaDto> {
    const perfil = await this.prisma.perfis.findUnique({
      where: { id: createUsuarioDto.perfil_id },
      select: { id: true },
    });

    if (!perfil) {
      throw new NotFoundException('Perfil não encontrado.');
    }

    const email = createUsuarioDto.email.trim().toLowerCase();
    const hashSenha = await this.senhasService.gerarHash(createUsuarioDto.senha);

    try {
      const usuario = await this.prisma.usuarios.create({
        data: {
          email,
          senha: hashSenha,
          perfis: { connect: { id: perfil.id } },
        },
        select: {
          id: true,
          email: true,
          perfis: { select: { nome: true } },
        },
      });

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
    const usuarioAutenticado = await this.prisma.usuarios.findUnique({
      where: { id: usuarioId },
      select: { perfis: { select: { nome: true } } },
    });

    if (!usuarioAutenticado) {
      throw new UnauthorizedException('Sessão inválida.');
    }

    if (usuarioAutenticado.perfis?.nome !== 'ADMIN_PROFESSOR') {
      throw new ForbiddenException('Apenas o professor pode listar usuários.');
    }

    const condicoes: Prisma.usuariosWhereInput = {};

    if (filtros.perfil_id) {
      condicoes.perfil_id = filtros.perfil_id;
    }

    if (filtros.email) {
      condicoes.email = { contains: filtros.email, mode: 'insensitive' };
    }

    const total = await this.prisma.usuarios.count({ where: condicoes });
    const usuarios = await this.prisma.usuarios.findMany({
      where: condicoes,
      select: {
        id: true,
        email: true,
        perfis: { select: { nome: true } },
      },
      orderBy: { id: 'asc' },
      skip: (filtros.page - 1) * filtros.limit,
      take: filtros.limit,
    });

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
    const usuarioAutenticado = await this.prisma.usuarios.findUnique({
      where: { id: usuarioId },
      select: { id: true, perfis: { select: { nome: true } } },
    });

    if (!usuarioAutenticado) {
      throw new UnauthorizedException('Sessão inválida.');
    }

    if (
      id !== usuarioId &&
      usuarioAutenticado.perfis?.nome !== 'ADMIN_PROFESSOR'
    ) {
      throw new ForbiddenException('Sem permissão para consultar este usuário.');
    }

    const usuario = await this.prisma.usuarios.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        perfis: { select: { nome: true } },
      },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return {
      id: usuario.id,
      email: usuario.email,
      perfil: usuario.perfis?.nome ?? null,
    };
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
