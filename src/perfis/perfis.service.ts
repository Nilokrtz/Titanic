import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ListarPerfisDto } from './dto/listar-perfis.dto.js';
import { ListarPerfisRespostaDto } from './dto/listar-perfis-resposta.dto.js';
import { PerfilRespostaDto } from './dto/perfil-resposta.dto.js';
import { UpdatePerfiDto } from './dto/update-perfi.dto.js';
import { PerfisRepository } from './perfis.repository.js';
import { PermissoesRepository } from '../permissoes/permissoes.repository.js';
import { AdicionarPermissaoPerfilDto } from './dto/adicionar-permissao-perfil.dto.js';


@Injectable()
export class PerfisService {
  constructor(
    private readonly repository: PerfisRepository,
    private readonly permissoesRepository: PermissoesRepository,
  ) {}

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

  async listarPermissoes(id: number) {
    const perfil = await this.repository.listarPermissoesDoPerfil(id);
    if (!perfil) {
      throw new NotFoundException(`Perfil com ID ${id} não encontrado.`);
    }

    const permissoes = perfil.perfis_permissoes.map((item) => item.permissoes);

    return { dados: permissoes };
  }

  async adicionarPermissao(id: number, dto: AdicionarPermissaoPerfilDto) {
    const perfil = await this.repository.buscarPorId(id);
    if (!perfil) {
      throw new NotFoundException(`Perfil com ID ${id} não encontrado.`);
    }

    const permissao = await this.permissoesRepository.buscarPorId(dto.permissaoId);
    if (!permissao) {
      throw new NotFoundException(`Permissão com ID ${dto.permissaoId} não encontrada.`);
    }

    return this.repository.adicionarPermissao(id, dto.permissaoId);
  }
}
