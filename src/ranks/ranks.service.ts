import { Injectable } from '@nestjs/common';
import { CreateRankDto } from './dto/create-rank.dto.js';
import { UpdateRankDto } from './dto/update-rank.dto.js';

@Injectable()
export class RanksService {
  create(createRankDto: CreateRankDto) {
    return 'This action adds a new rank';
  }

  findAll() {
    return `This action returns all ranks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rank`;
  }

  update(id: number, updateRankDto: UpdateRankDto) {
    return `This action updates a #${id} rank`;
  }

  remove(id: number) {
    return `This action removes a #${id} rank`;
  }
}
