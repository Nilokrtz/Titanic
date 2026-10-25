import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {RedisCacheService} from '../common/redis-cache.service.js';
import {DisciplinasRepository} from './disciplinas.repository.js';
import {CreateDisciplinaDto} from './dto/create-disciplina.dto.js';
import {FindDisciplinasQueryDto} from './dto/find-disciplinas-query.dto.js';
import {UpdateDisciplinaDto} from './dto/update-disciplina.dto.js';

@Injectable()
export class DisciplinasService {
  constructor(
    private readonly repository: DisciplinasRepository,
    private readonly cache: RedisCacheService,
  ) {}

  async create(dados: CreateDisciplinaDto) {
    const disciplinaExistente = await this.repository.buscarPorNome(dados.nome);
    if (disciplinaExistente) {
      throw new BadRequestException(
        `A disciplina "${dados.nome}" já está cadastrada.`,
      );
    }

    const disciplina = await this.repository.criar(dados);
    await this.limparCaches();
    return disciplina;
  }

  async findAll(query: FindDisciplinasQueryDto) {
    const chave = `disciplinas:lista:${JSON.stringify(query)}`;
    return this.cache.consultar(chave, async () => {
      const page = query.page ?? 1;
      const limit = query.limit ?? 10;
      const { dados, total } = await this.repository.listarComPaginacao(query);

      return {
        dados,
        total,
        page,
        limit,
        totalPaginas: Math.ceil(total / limit),
      };
    });
  }

  async findOne(id: number) {
    const disciplina = await this.repository.buscarPorId(id);
    if (!disciplina) {
      throw new NotFoundException(
        `Disciplina com o ID ${id} não foi encontrada.`,
      );
    }

    return disciplina;
  }

  async update(id: number, dados: UpdateDisciplinaDto) {
    await this.findOne(id);

    if (dados.nome !== undefined) {
      const disciplinaComMesmoNome = await this.repository.buscarPorNome(
        dados.nome,
      );
      if (disciplinaComMesmoNome && disciplinaComMesmoNome.id !== id) {
        throw new BadRequestException(
          `A disciplina "${dados.nome}" já está cadastrada.`,
        );
      }
    }

    const disciplina = await this.repository.atualizar(id, dados);
    await this.limparCaches();
    return disciplina;
  }

  async remove(id: number) {
    await this.findOne(id);

    const salasVinculadas = await this.repository.contarSalasVinculadas(id);
    if (salasVinculadas > 0) {
      throw new BadRequestException(
        'A disciplina não pode ser removida enquanto estiver vinculada a uma sala de desafio.',
      );
    }

    await this.repository.remover(id);
    await this.limparCaches();
    return { mensagem: `Disciplina com o ID ${id} foi removida com sucesso.` };
  }

  private async limparCaches() {
    await Promise.all([
      this.cache.limpar('disciplinas:'),
      this.cache.limpar('salas:'),
    ]);
  }
}
