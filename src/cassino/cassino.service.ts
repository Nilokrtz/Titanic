import { Injectable } from '@nestjs/common';
import { CreateCassinoDto } from './dto/create-cassino.dto.js';
import { UpdateCassinoDto } from './dto/update-cassino.dto.js';

@Injectable()
export class CassinoService {
  create(createCassinoDto: CreateCassinoDto) {
    return 'This action adds a new cassino';
  }

  findAll() {
    return `This action returns all cassino`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cassino`;
  }

  update(id: number, updateCassinoDto: UpdateCassinoDto) {
    return `This action updates a #${id} cassino`;
  }

  remove(id: number) {
    return `This action removes a #${id} cassino`;
  }
}
