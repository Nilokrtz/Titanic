import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegistrarDto } from './dto/registrar.dto.js';
import { RegistrarRespostaDto } from './dto/registrar-resposta.dto.js';
import { SenhasService } from './senhas.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly senhasService: SenhasService,
  ) {}

  async registrar(registro: RegistrarDto): Promise<RegistrarRespostaDto> {
    const perfilAluno = await this.prisma.perfis.findUnique({
      where: { nome: 'ALUNO' },
      select: { id: true },
    });

    if (!perfilAluno) {
      throw new InternalServerErrorException('Perfil ALUNO não configurado.');
    }

    const email = registro.email.trim().toLowerCase();
    const hashSenha = await this.senhasService.gerarHash(registro.senha);

    try {
      const usuario = await this.prisma.usuarios.create({
        data: {
          email,
          senha: hashSenha,
          perfis: { connect: { id: perfilAluno.id } },
        },
        select: { id: true, email: true },
      });

      return { id: usuario.id, email: usuario.email, perfil: 'ALUNO' };
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
}
