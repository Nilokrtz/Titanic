import { ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Prisma, tipo_perfil } from '../generated/prisma/client.js';
import { PersonagensRepository } from './personagens.repository.js';
import { CreatePersonagenDto } from './dto/create-personagen.dto.js';
import { ListarPersonagensDto } from './dto/listar-personagens.dto.js';
import { ListarPersonagensRespostaDto } from './dto/listar-personagens-resposta.dto.js';
import { PersonagemRespostaDto } from './dto/personagem-resposta.dto.js';
import { UpdatePersonagenDto } from './dto/update-personagen.dto.js';

@Injectable()
export class PersonagensService {
  constructor(private readonly repository: PersonagensRepository) {}

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

  update(id: number, updatePersonagenDto: UpdatePersonagenDto) {
    return `This action updates a #${id} personagen`;
  }

  remove(id: number) {
    return `This action removes a #${id} personagen`;
  }
}
