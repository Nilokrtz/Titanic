import { Injectable } from '@nestjs/common';
import { CreateItenDto } from './dto/create-iten.dto.js';
import { UpdateItenDto } from './dto/update-iten.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';


@Injectable()
export class ItensService {
   constructor(private readonly prisma: PrismaService) {}

  

  create(createItenDto: CreateItenDto) {
    return this.prisma.itens.create({
      data: createItenDto,
    });
  }

  
  findAll() {
    return `This action returns all itens`;
  }

  findOne(id: number) {
    return `This action returns a #${id} iten`;
  }

  update(id: number, updateItenDto: UpdateItenDto) {
    return `This action updates a #${id} iten`;
  }

  remove(id: number) {
    return `This action removes a #${id} iten`;
  }
}
