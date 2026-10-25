import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCassinoDto } from './dto/create-cassino.dto.js';
import { UpdateCassinoDto } from './dto/update-cassino.dto.js';
import { FindCassinoQueryDto } from './dto/find-cassino-query.dto.js';
import { CassinoRepository } from './cassino.repository.js';

@Injectable()
export class CassinoService {
  constructor(private readonly repository: CassinoRepository) {}

  async create(dados: CreateCassinoDto) {
    const opcaoExiste = await this.repository.buscarPorNome(dados.nome);
    if(opcaoExiste){
      throw new BadRequestException(`Opção '${dados.nome}' já existe.`)
    }
    return await this.repository.criar(dados);
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
