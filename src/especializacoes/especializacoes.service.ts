import { Injectable } from '@nestjs/common';
import { CreateEspecializacoeDto } from './dto/create-especializacoe.dto.js';
import { UpdateEspecializacoeDto } from './dto/update-especializacoe.dto.js';

@Injectable()
export class EspecializacoesService {
  create(createEspecializacoeDto: CreateEspecializacoeDto) {
    return 'This action adds a new especializacoe';
  }

  findAll() {
    return `This action returns all especializacoes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} especializacoe`;
  }

  update(id: number, updateEspecializacoeDto: UpdateEspecializacoeDto) {
    return `This action updates a #${id} especializacoe`;
  }

  remove(id: number) {
    return `This action removes a #${id} especializacoe`;
  }
}
