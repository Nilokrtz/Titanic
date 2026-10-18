import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { EspecializacoesRepository } from './especializacoes.repository.js';
import { CreateEspecializacoeDto } from './dto/create-especializacoes.dto.js';
import { UpdateEspecializacoeDto } from './dto/update-especializacoes.dto.js';

@Injectable()
export class EspecializacoesService {
  constructor(private readonly repository: EspecializacoesRepository) {}

  async create(dados: CreateEspecializacoeDto) {
    const nomeExiste = await this.repository.buscarPorNome(dados.nome);
    if(nomeExiste) {
      throw new BadRequestException(`A especialização "${dados.nome}" já está em uso.`);
    }
    return this.repository.criar(dados);
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
