import { Injectable } from '@nestjs/common';
import { CreateAtributoDto } from './dto/create-atributo.dto.js';
import { UpdateAtributoDto } from './dto/update-atributo.dto.js';

@Injectable()
export class AtributosService {
  create(createAtributoDto: CreateAtributoDto) {
    return 'This action adds a new atributo';
  }

  findAll() {
    return `This action returns all atributos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} atributo`;
  }

  update(id: number, updateAtributoDto: UpdateAtributoDto) {
    return `This action updates a #${id} atributo`;
  }

  remove(id: number) {
    return `This action removes a #${id} atributo`;
  }
}
