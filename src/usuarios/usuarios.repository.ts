import { Injectable } from '@nestjs/common';
import type { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ListarUsuariosDto } from './dto/listar-usuarios.dto.js';

@Injectable()
export class UsuariosRepository {
  constructor(private readonly prisma: PrismaService) {}

  buscarPerfil(id: number) {
    return this.prisma.perfis.findUnique({
      where: { id },
      select: { id: true },
    });
  }

  buscarUsuario(id: number) {
    return this.prisma.usuarios.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        excluido_em: true,
        perfis: { select: { nome: true } },
      },
    });
  }

  criar(email: string, senha: string, perfilId: number) {
    return this.prisma.usuarios.create({
      data: {
        email,
        senha,
        perfis: { connect: { id: perfilId } },
      },
      select: {
        id: true,
        email: true,
        perfis: { select: { nome: true } },
      },
    });
  }

  async listar(filtros: ListarUsuariosDto) {
    const condicoes: Prisma.usuariosWhereInput = { excluido_em: null };

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

    return { usuarios, total };
  }

  atualizar(id: number, dados: Prisma.usuariosUpdateInput) {
    return this.prisma.usuarios.update({
      where: { id },
      data: dados,
      select: {
        id: true,
        email: true,
        perfis: { select: { nome: true } },
      },
    });
  }

  excluir(id: number) {
    return this.prisma.usuarios.updateMany({
      where: { id, excluido_em: null },
      data: { excluido_em: new Date(), refresh_token_hash: null },
    });
  }
}
