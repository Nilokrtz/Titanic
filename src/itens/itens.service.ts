import { Injectable } from '@nestjs/common';
import { CreateItenDto } from './dto/create-iten.dto.js';
import { UpdateItenDto } from './dto/update-iten.dto.js';

@Injectable()
export class ItensService {
  create(createItenDto: CreateItenDto) {
    return 'This action adds a new iten';
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
