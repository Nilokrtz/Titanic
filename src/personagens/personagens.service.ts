import { Injectable } from '@nestjs/common';
import { CreatePersonagenDto } from './dto/create-personagen.dto.js';
import { UpdatePersonagenDto } from './dto/update-personagen.dto.js';

@Injectable()
export class PersonagensService {
  create(createPersonagenDto: CreatePersonagenDto) {
    return 'This action adds a new personagen';
  }

  findAll() {
    return `This action returns all personagens`;
  }

  findOne(id: number) {
    return `This action returns a #${id} personagen`;
  }

  update(id: number, updatePersonagenDto: UpdatePersonagenDto) {
    return `This action updates a #${id} personagen`;
  }

  remove(id: number) {
    return `This action removes a #${id} personagen`;
  }
}
