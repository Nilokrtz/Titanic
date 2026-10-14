import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePerfiDto } from './dto/create-perfi.dto.js';
import { PerfilRespostaDto } from './dto/perfil-resposta.dto.js';
import { UpdatePerfiDto } from './dto/update-perfi.dto.js';

@Injectable()
export class PerfisService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPerfiDto: CreatePerfiDto) {
    return 'This action adds a new perfi';
  }

  findAll() {
    return `This action returns all perfis`;
  }

  async findOne(id: number): Promise<PerfilRespostaDto> {
    const perfil = await this.prisma.perfis.findUnique({
      where: { id },
      select: { id: true, nome: true, descricao: true },
    });

    if (!perfil) {
      throw new NotFoundException('Perfil não encontrado.');
    }

    return perfil;
  }

  update(id: number, updatePerfiDto: UpdatePerfiDto) {
    return `This action updates a #${id} perfi`;
  }

  remove(id: number) {
    return `This action removes a #${id} perfi`;
  }
}
