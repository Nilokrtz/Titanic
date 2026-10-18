import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { EspecializacoesRepository } from './especializacoes.repository.js';
import { CreateEspecializacoeDto } from './dto/create-especializacoes.dto.js';
import { UpdateEspecializacoeDto } from './dto/update-especializacoes.dto.js';
import { FindEspecializacoesQueryDto } from './dto/find-especializacoes-query.dto.js';

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

  async findAll(query: FindEspecializacoesQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const{dados, total} = await this.repository.listarComPaginacao(query);
    const totalPaginas = Math.ceil(total / limit);

    return{
      dados,
      total,
      page,
      totalPaginas,
      limit,
    };
  }

  async findOne(id: number) {
    const especializacoe = await this.repository.buscarPorId(id);
    if(!especializacoe) {
      throw new NotFoundException(`Especialização com o ID ${id} não foi encontrada.`);
    }
    return especializacoe;
  }

  update(id: number, updateEspecializacoeDto: UpdateEspecializacoeDto) {
    return `This action updates a #${id} especializacoe`;
  }

  remove(id: number) {
    return `This action removes a #${id} especializacoe`;
  }
}
