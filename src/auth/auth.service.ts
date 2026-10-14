import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegistrarDto } from './dto/registrar.dto.js';
import { RegistrarRespostaDto } from './dto/registrar-resposta.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { LoginRespostaDto } from './dto/login-resposta.dto.js';
import { SenhasService } from './senhas.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly senhasService: SenhasService,
    private readonly jwtService: JwtService,
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

  async login(credenciais: LoginDto): Promise<LoginRespostaDto> {
    const email = credenciais.email.trim().toLowerCase();
    const usuario = await this.prisma.usuarios.findUnique({
      where: { email },
      select: { id: true, senha: true },
    });

    if (
      !usuario ||
      !(await this.senhasService.conferirSenha(
        credenciais.senha,
        usuario.senha,
      ))
    ) {
      throw new UnauthorizedException('Email ou senha inválidos.');
    }

    return {
      access_token: await this.jwtService.signAsync({ sub: usuario.id }),
      token_type: 'Bearer',
      expires_in: 900,
    };
  }
}
