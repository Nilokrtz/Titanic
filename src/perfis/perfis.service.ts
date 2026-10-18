import { Injectable, NotFoundException } from '@nestjs/common';
import { ListarPerfisDto } from './dto/listar-perfis.dto.js';
import { ListarPerfisRespostaDto } from './dto/listar-perfis-resposta.dto.js';
import { PerfilRespostaDto } from './dto/perfil-resposta.dto.js';
import { UpdatePerfiDto } from './dto/update-perfi.dto.js';
import { PerfisRepository } from './perfis.repository.js';

@Injectable()
export class PerfisService {
  constructor(private readonly repository: PerfisRepository) {}

  findAll(filtros: ListarPerfisDto): Promise<ListarPerfisRespostaDto> {
    return this.repository.listar(filtros);
  }

  async findOne(id: number): Promise<PerfilRespostaDto> {
    const perfil = await this.repository.buscarPorId(id);

    if (!perfil) {
      throw new NotFoundException('Perfil não encontrado.');
    }

    return perfil;
  }

  async update(
    id: number,
    atualizacao: UpdatePerfiDto,
  ): Promise<PerfilRespostaDto> {
    const perfil = await this.repository.buscarPorId(id);

    if (!perfil) {
      throw new NotFoundException('Perfil não encontrado.');
    }

    return this.repository.atualizarDescricao(id, atualizacao.descricao);
  }
}
