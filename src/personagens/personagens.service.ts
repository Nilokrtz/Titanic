import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Prisma, tipo_perfil } from '../generated/prisma/client.js';
import { PersonagensRepository } from './personagens.repository.js';
import { CreatePersonagenDto } from './dto/create-personagen.dto.js';
import { ListarPersonagensDto } from './dto/listar-personagens.dto.js';
import { ListarPersonagensRespostaDto } from './dto/listar-personagens-resposta.dto.js';
import { PersonagemRespostaDto } from './dto/personagem-resposta.dto.js';
import { UpdatePersonagenDto } from './dto/update-personagen.dto.js';
import { ListarPersonagensMeDto } from './dto/listar-personagens-me.dto.js';
import { RankingXpQueryDto } from './dto/ranking-xp-query.dto.js';
import { RankingXpRespostaDto } from './dto/ranking-xp-resposta.dto.js';
import { ListarTentativasPersonagemDto } from './dto/listar-tentativas-personagem.dto.js';
import { RedisCacheService } from '../common/redis-cache.service.js';

@Injectable()
export class PersonagensService {
  constructor(
    private readonly repository: PersonagensRepository,
    private readonly rankingCache: RedisCacheService,
  ) {}

  async create(createPersonagenDto: CreatePersonagenDto, usuarioId: number) {
    const usuario = await this.repository.buscarUsuarioPorId(usuarioId);

    if (!usuario) {
      throw new UnauthorizedException('Sessão inválida.');
    }

    const especializacaoId = createPersonagenDto.especializacao_id;

    const especializacao = await this.repository.buscarEspecializacaoPorId(
      especializacaoId,
    );

    if (!especializacao) {
      throw new NotFoundException('Especialização não encontrada.');
    }

    const rankInicial = await this.repository.buscarRankInicial();

    if (!rankInicial) {
      throw new NotFoundException('Ranking inicial não encontrado.');
    }

    const personagemExistente =
      await this.repository.buscarPersonagemPorUsuarioId(usuarioId);

    if (personagemExistente) {
      throw new ConflictException('Usuário já possui um personagem.');
    }

    const nomeExistente = await this.repository.buscarPersonagemPorNome(
      createPersonagenDto.nome,
    );

    if (nomeExistente) {
      throw new ConflictException('Nome de personagem já cadastrado.');
    }

    try {
      return await this.repository.criar(
        createPersonagenDto,
        usuarioId,
        rankInicial.id,
      );
    } catch (erro) {
      if (
        erro instanceof Prisma.PrismaClientKnownRequestError &&
        erro.code === 'P2002'
      ) {
        throw new ConflictException(
          'Nome de personagem já cadastrado ou usuário já possui um personagem.',
        );
      }

      throw erro;
    }
  }

  findAll(filtros: ListarPersonagensDto): Promise<ListarPersonagensRespostaDto> {
    return this.repository.listar(filtros);
  }

  async rankingXp(filtros: RankingXpQueryDto): Promise<RankingXpRespostaDto> {
    const chave = `ranking:xp:${filtros.page ?? 1}:${filtros.limit ?? 10}:${filtros.especializacao_id ?? 'todos'}:${filtros.rank_id ?? 'todos'}`;
    return this.rankingCache.consultar(chave, () => this.repository.listarRankingXp(filtros));
  }

  async findOne(id: number, usuarioId: number): Promise<PersonagemRespostaDto> {
    const usuario = await this.repository.buscarPerfilDoUsuario(usuarioId);

    if (!usuario || usuario.excluido_em) {
      throw new UnauthorizedException('Sessão inválida.');
    }

    const personagem = await this.repository.buscarPersonagemPorId(id);

    if (!personagem) {
      throw new NotFoundException('Personagem não encontrado.');
    }

    const perfil = usuario.perfis?.nome;

    if (
      personagem.usuario_id !== usuarioId &&
      perfil !== tipo_perfil.ADMIN_PROFESSOR &&
      perfil !== tipo_perfil.MONITOR
    ) {
      throw new ForbiddenException('Sem permissão para consultar este personagem.');
    }

    return personagem;
  }

  async listarTentativas(
    personagemId: number,
    usuarioId: number,
    filtros: ListarTentativasPersonagemDto,
  ) {
    if (
      !Number.isSafeInteger(personagemId) ||
      personagemId < 1 ||
      personagemId > 2147483647
    ) {
      throw new BadRequestException('ID do personagem inválido.');
    }

    await this.findOne(personagemId, usuarioId);
    return this.repository.listarTentativas(personagemId, filtros);
  }

  async findMe(
  usuarioId: number,
  filtros: ListarPersonagensMeDto,
): Promise<ListarPersonagensRespostaDto> {
  const usuario = await this.repository.buscarPerfilDoUsuario(usuarioId);

  if (!usuario || usuario.excluido_em) {
    throw new UnauthorizedException('Sessão inválida.');
  }

  return this.repository.listarMe(usuarioId, filtros);
}

  async update(
    id: number,
    atualizacao: UpdatePersonagenDto,
    usuarioId: number,
  ): Promise<PersonagemRespostaDto> {
    const personagem = await this.repository.buscarPersonagemPorId(id);

    if (!personagem) {
      throw new NotFoundException('Personagem não encontrado.');
    }

    if (personagem.usuario_id !== usuarioId) {
      throw new ForbiddenException('Só o dono pode alterar este personagem.');
    }

    const nome = atualizacao.nome.trim();

    if (!nome) {
      throw new BadRequestException('Nome inválido.');
    }

    try {
      return await this.repository.atualizarNome(id, usuarioId, nome);
    } catch (erro) {
      if (erro instanceof Prisma.PrismaClientKnownRequestError) {
        if (erro.code === 'P2002') {
          throw new ConflictException('Nome de personagem já cadastrado.');
        }

        if (erro.code === 'P2025') {
          throw new NotFoundException('Personagem não encontrado.');
        }
      }

      throw erro;
    }
  }

  async remove(id: number): Promise<void> {
    const excluidos = await this.repository.excluir(id);

    if (excluidos.count === 0) {
      throw new NotFoundException('Personagem não encontrado.');
    }
  }
}
