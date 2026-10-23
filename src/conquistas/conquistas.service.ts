import { Injectable, NotFoundException , BadRequestException } from '@nestjs/common';
import { CreateConquistaDto } from './dto/create-conquista.dto.js';
import { UpdateConquistaDto } from './dto/update-conquista.dto.js';
import { FindConquistasQueryDto } from './dto/find-conquistas-query.dto.js';
import { ConquistasRepository } from './conquista.repository.js';

@Injectable()
export class ConquistasService {
  constructor(private readonly repository: ConquistasRepository) {}
  
  async create(dados: CreateConquistaDto) {
    const conquistaExiste = await this.repository.buscarPorNome(dados.nome);
    if (conquistaExiste) {
      throw new Error(`Conquista com nome ${dados.nome} ja existe.`);
    }
    return await this.repository.criar(dados);
  }

  async findAll(query: FindConquistasQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const { dados, total } = await this.repository.listarComPaginacao(query);
    const totalPaginas = Math.ceil(total / limit);
    return {
      dados,
      total,
      page,
      limit,
      totalPaginas
    };
  }

  async findOne(id: number) {
    const conquista = await this.repository.buscarPorId(id);
    if (!conquista) {
      throw new NotFoundException(`Conquista com ID ${id} nao encontrada.`);
    }
    return conquista;
  }

  async update(id: number, updateConquistaDto: UpdateConquistaDto) {
    const conquista = await this.repository.buscarPorId(id);
    if (!conquista) {
      throw new NotFoundException(`Conquista com ID ${id} nao encontrada.`);
    }
    return await this.repository.atualizar(id, updateConquistaDto);
  }

  async remove(id: number) {
    const conquista = await this.repository.buscarPorId(id);
    if (!conquista) {
      throw new NotFoundException(`Conquista com ID ${id} nao encontrada.`);
    }
    return await this.repository.remover(id);
  }

  async verificarProgresso(personagemId: number) {
    const dados = await this.repository.buscarProgressoPersonagem(personagemId);
    
    if (!dados.personagem) {
      throw new BadRequestException(`Personagem com ID ${personagemId} nao encontrado.`);
    }
    const personagem = dados.personagem;
    const conquistas = dados.todasConquistas;
    const tentativas = dados.tentativas;

    let totalErros = 0;
    let venceuEevee = false;
    let venceuBossFinal = false;
    let monitoresDerrotados = false;
  


    for (const tentativa of tentativas) {
      if(tentativa.erros){
        totalErros += tentativa.erros;
      }

    if (tentativa.status === 'VITORIA' )  {
      const chefe = tentativa.salas_desafio?.chefe_nome?.toLowerCase() || '';
      const nomeSala = tentativa.salas_desafio?.nome?.toLowerCase() || '';
      
      if (chefe === 'eevee' || nomeSala.includes('eevee')) {
        venceuEevee = true;
      }

      if (chefe.includes('eduardo') && chefe.includes('gabriel')) {
        monitoresDerrotados = true;
      }
  

      if (chefe.includes('boss final') || nomeSala.includes('boss final')) {
        venceuBossFinal = true;
      }
    }
  }

  const resultado = conquistas.map(conquista => {
    let progresso = false;

    if (conquista.nome.includes('trabalho infinito')) {
      progresso = venceuEevee;
    } else if (conquista.nome.includes('Diploma Desbloqueado')) {
      progresso = venceuBossFinal;
    } else if (conquista.nome.includes('MegaBrain Unlocked')) {
      progresso = venceuBossFinal && totalErros === 0;
    } else if (conquista.nome.includes('Muquirana')) {
      progresso = (personagem.moedas ?? 0) >= 350;
    } else if (conquista.nome.includes('Mestre dos Monitores')) {
      progresso = monitoresDerrotados;
    }

    return {
      id: conquista.id,
      nome: conquista.nome,
      descricao: conquista.descricao,
      recompensa: conquista.recompensa,
      progresso,
      status: progresso ? 'DESBLOQUEADA' : 'BLOQUEADA',
    };
  });

  return {
    personagem: personagem.nome,
    moedas_atual: (personagem.moedas ?? 0),
    total_erros: totalErros,
    conquistas: resultado,
  };
 }
}
  