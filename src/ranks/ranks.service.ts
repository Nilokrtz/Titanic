import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { RanksRepository } from './ranks.repository.js';
import { CreateRankDto } from './dto/create-rank.dto.js';
import { UpdateRankDto } from './dto/update-rank.dto.js';
import { FindRanksQueryDto } from './dto/find-ranks-query.dto.js';
import { RedisCacheService } from '../common/redis-cache.service.js';


@Injectable()
export class RanksService {
  constructor(
    private readonly repository: RanksRepository,
    private readonly cache: RedisCacheService,
  ) {}

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

    const rank = await this.repository.criar(createRankDto);
    await this.cache.limpar('ranks:lista:');
    return rank;
  }

  async findAll(query: FindRanksQueryDto) {
    const chave = `ranks:lista:${JSON.stringify(query)}`;
    return this.cache.consultar(chave, async () => {
      const page = query.page ?? 1;
      const limit = query.limit ?? 10;
      const {data, total} = await this.repository.listarComPaginacao(query);

      return {
        data,
        total,
        page,
        totalPaginas: Math.ceil(total / limit),
        limit,
      };
    });
  }

  async findOne(id: number) {
    const rank = await this.repository.buscarPorId(id);

    if (!rank) {
      throw new NotFoundException(`Rank com o ID ${id} não foi encontrado.`);
    }

    return rank;
  }

  async update(id: number, updateRankDto: UpdateRankDto) {
    await this.findOne(id); 

    if(updateRankDto.nome !== undefined) { 
      const rankComMesmoNome = await this.repository.buscarPorNome(updateRankDto.nome);
      if (rankComMesmoNome && rankComMesmoNome.id !== id) {
        throw new BadRequestException(`O nome "${updateRankDto.nome}" já está em uso.`);
      }
    }

    if(updateRankDto.nivel_acesso !== undefined) {
      const rankComMesmoNivel = await this.repository.buscarPorNivelAcesso(updateRankDto.nivel_acesso);
      if (rankComMesmoNivel && rankComMesmoNivel.id !== id) {
        throw new BadRequestException(`O nível de acesso "${updateRankDto.nivel_acesso}" já está em uso.`);
      }
    }

    if(updateRankDto.xp_minimo !== undefined) {
      const rankComMesmoXp = await this.repository.buscarPorXpMinimo(updateRankDto.xp_minimo);
      if (rankComMesmoXp && rankComMesmoXp.id !== id) {
        throw new BadRequestException(`O valor de XP "${updateRankDto.xp_minimo}" já está em uso.`);
      }
    }

    const rank = await this.repository.atualizar(id, updateRankDto);
    await this.cache.limpar('ranks:lista:');
    await this.cache.limpar('salas:');
    return rank;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repository.remover(id);
    await this.cache.limpar('ranks:lista:');
    await this.cache.limpar('salas:');
    return { message: `Rank foi removido com sucesso.` };
  }
}
