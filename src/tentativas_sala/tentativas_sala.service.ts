import { Injectable } from '@nestjs/common';
import { CreateTentativasSalaDto } from './dto/create-tentativas_sala.dto.js';
import { UpdateTentativasSalaDto } from './dto/update-tentativas_sala.dto.js';

@Injectable()
export class TentativasSalaService {
  create(createTentativasSalaDto: CreateTentativasSalaDto) {
    return 'This action adds a new tentativasSala';
  }

  findAll() {
    return `This action returns all tentativasSala`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tentativasSala`;
  }

  update(id: number, updateTentativasSalaDto: UpdateTentativasSalaDto) {
    return `This action updates a #${id} tentativasSala`;
  }

  remove(id: number) {
    return `This action removes a #${id} tentativasSala`;
  }
}
