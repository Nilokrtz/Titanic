import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSalasDesafioDto } from './dto/create-salas_desafio.dto.js';

@Injectable()
export class SalasDesafioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async buscarPorNumeroSala(numeroSala: number) {
    return this.prisma.salas_desafio.findUnique({
      where: { numero_sala: numeroSala },
    });
  }

  async buscarRankPorId(rankId: number) {
    return this.prisma.ranks.findUnique({
      where: { id: rankId },
    });
  }

  async criar(data: CreateSalasDesafioDto) {
    return this.prisma.salas_desafio.create({
      data,
      include: {
        ranks: true,
      },
    });
  }

  async listarTodasAsSalas(){
    return this.prisma.salas_desafio.findMany({
      include:{
        ranks: true
      },
      orderBy:{
        numero_sala: 'asc'
      }
    });
  }

  async buscarSalaPorId(id: Number){
    return this.prisma.salas_desafio.findUnique({
      where:{id},
      include:{
        ranks: true
      }
    });
  }
}