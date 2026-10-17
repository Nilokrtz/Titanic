import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { UsuarioRespostaDto } from './dto/usuario-resposta.dto.js';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUsuarioDto: CreateUsuarioDto) {
    return 'This action adds a new usuario';
  }

  findAll() {
    return `This action returns all usuarios`;
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
