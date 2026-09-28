import { Injectable } from '@nestjs/common';
import { CreateSalasDesafioDto } from './dto/create-salas_desafio.dto.js';
import { UpdateSalasDesafioDto } from './dto/update-salas_desafio.dto.js';

@Injectable()
export class SalasDesafioService {
  create(createSalasDesafioDto: CreateSalasDesafioDto) {
    return 'This action adds a new salasDesafio';
  }

  findAll() {
    return `This action returns all salasDesafio`;
  }

  findOne(id: number) {
    return `This action returns a #${id} salasDesafio`;
  }

  update(id: number, updateSalasDesafioDto: UpdateSalasDesafioDto) {
    return `This action updates a #${id} salasDesafio`;
  }

  remove(id: number) {
    return `This action removes a #${id} salasDesafio`;
  }
}
