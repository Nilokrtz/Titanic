import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  buscarPerfilAluno() {
    return this.prisma.perfis.findUnique({
      where: { nome: 'ALUNO' },
      select: { id: true },
    });
  }

  criarAluno(email: string, senha: string, perfilId: number) {
    return this.prisma.usuarios.create({
      data: {
        email,
        senha,
        perfis: { connect: { id: perfilId } },
      },
      select: { id: true, email: true },
    });
  }

  buscarCredenciais(email: string) {
    return this.prisma.usuarios.findUnique({
      where: { email },
      select: { id: true, senha: true, excluido_em: true },
    });
  }

  salvarRefreshToken(usuarioId: number, hash: string) {
    return this.prisma.usuarios.update({
      where: { id: usuarioId },
      data: { refresh_token_hash: hash },
    });
  }

  renovarRefreshToken(
    usuarioId: number,
    hashAnterior: string,
    novoHash: string,
  ) {
    return this.prisma.usuarios.updateMany({
      where: {
        id: usuarioId,
        excluido_em: null,
        refresh_token_hash: hashAnterior,
      },
      data: { refresh_token_hash: novoHash },
    });
  }

  limparRefreshToken(usuarioId: number) {
    return this.prisma.usuarios.updateMany({
      where: { id: usuarioId, excluido_em: null },
      data: { refresh_token_hash: null },
    });
  }

  buscarSenha(usuarioId: number) {
    return this.prisma.usuarios.findUnique({
      where: { id: usuarioId },
      select: { senha: true, excluido_em: true },
    });
  }

  alterarSenha(usuarioId: number, hashAnterior: string, novoHash: string) {
    return this.prisma.usuarios.updateMany({
      where: { id: usuarioId, senha: hashAnterior, excluido_em: null },
      data: { senha: novoHash, refresh_token_hash: null },
    });
  }

  buscarDados(usuarioId: number) {
    return this.prisma.usuarios.findUnique({
      where: { id: usuarioId },
      select: {
        id: true,
        email: true,
        excluido_em: true,
        perfis: { select: { nome: true } },
      },
    });
  }

  buscarSessao(usuarioId: number) {
    return this.prisma.usuarios.findUnique({
      where: { id: usuarioId },
      select: { excluido_em: true },
    });
  }

  buscarPerfil(usuarioId: number) {
    return this.prisma.usuarios.findUnique({
      where: { id: usuarioId },
      select: { perfis: { select: { nome: true } } },
    });
  }
}
