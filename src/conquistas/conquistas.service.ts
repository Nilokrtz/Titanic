import { Injectable } from '@nestjs/common';
import { CreateConquistaDto } from './dto/create-conquista.dto.js';
import { UpdateConquistaDto } from './dto/update-conquista.dto.js';

@Injectable()
export class ConquistasService {
  create(createConquistaDto: CreateConquistaDto) {
    return 'This action adds a new conquista';
  }

  findAll() {
    return `This action returns all conquistas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} conquista`;
  }

  update(id: number, updateConquistaDto: UpdateConquistaDto) {
    return `This action updates a #${id} conquista`;
  }

  remove(id: number) {
    return `This action removes a #${id} conquista`;
  }
}
