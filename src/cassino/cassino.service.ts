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

  async findAll(query: FindCassinoQueryDto) {
    const page = query;page ?? 1
    const limit = query.limit ?? 10

    const { dados, total} = await this.repository.listarComPaginacao(query);
    const totalPaginas = Math.ceil(total/limit)

    return{
      dados,
      total,
      page,
      limit,
      totalPaginas
    };
  }

  async findOne(id: number) {
    const opcao = await this.repository.buscarPorId(id)
    if(!opcao){
      throw new NotFoundException(`Opção com ID ${id} não encontrada.`)
    }
    return opcao;
  }

  async update(id: number, updateCassinoDto: UpdateCassinoDto) {
    await this.findOne(id);
    if(updateCassinoDto.nome !== undefined){
      const opcaoComMesmoNome = await this.repository.buscarPorNome(updateCassinoDto.nome);
      if(opcaoComMesmoNome && opcaoComMesmoNome.id !== id){
        throw new BadRequestException(`A opção com o nome "${updateCassinoDto.nome}" já existe.`)
      }
    }
    return await this.repository.atualizar(id, updateCassinoDto);
  }

  remove(id: number) {
    return `This action removes a #${id} cassino`;
  }
}
