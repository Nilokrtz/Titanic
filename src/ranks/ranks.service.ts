import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { RanksRepository } from './ranks.repository.js';
import { CreateRankDto } from './dto/create-rank.dto.js';
import { UpdateRankDto } from './dto/update-rank.dto.js';
import { FindRanksQueryDto } from './dto/find-ranks-query.dto.js';


@Injectable()
export class RanksService {
  constructor(private readonly repository: RanksRepository) {}

  async create(createRankDto: CreateRankDto) {
    const nomeExiste = await this.repository.buscarPorNome(createRankDto.nome);
    if (nomeExiste) {
      throw new BadRequestException(`O nome "${createRankDto.nome}" já está em uso.`);
    }

    const nivelExiste = await this.repository.buscarPorNivelAcesso(createRankDto.nivel_acesso);
    if (nivelExiste) {
      throw new BadRequestException(`O nível de acesso "${createRankDto.nivel_acesso}" já está em uso.`);
    }

    const xpExiste = await this.repository.buscarPorXpMinimo(createRankDto.xp_minimo);
    if (xpExiste) {
      throw new BadRequestException(`Já existe um rank cadastrado para o valor de "${createRankDto.xp_minimo}" XP.`);
    }

    return this.repository.criar(createRankDto);
  }

  async findAll(query: FindRanksQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10; 

    const {data, total} = await this.repository.listarComPaginacao(query);
    const totalPaginas = Math.ceil(total / limit);

    return {
        data,
        total,
        page,
        totalPaginas,
        limit,
    };
  }

  async findOne(id: number) {
    const rank = await this.repository.buscarPorId(id);

    if (!rank) {
      throw new NotFoundException(`Rank com o ID ${id} não foi encontrado.`);
    }

    return rank;
  }

  update(id: number, updateRankDto: UpdateRankDto) {
    return `This action updates a #${id} rank`;
  }

  remove(id: number) {
    return `This action removes a #${id} rank`;
  }
}
