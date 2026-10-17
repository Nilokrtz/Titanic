import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import type { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { ListarUsuariosDto } from './dto/listar-usuarios.dto.js';
import { ListarUsuariosRespostaDto } from './dto/listar-usuarios-resposta.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { UsuarioRespostaDto } from './dto/usuario-resposta.dto.js';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUsuarioDto: CreateUsuarioDto) {
    return 'This action adds a new usuario';
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
