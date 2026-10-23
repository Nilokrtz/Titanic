import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTentativasDto } from './dto/create-tentativas_sala.dto.js';
import { DesistirTentativaDto } from './dto/desistir-tentativas.dto.js';
import { FindTentativasQueryDto } from './dto/find-tentativas-query.dto.js';
import { ResponderTentativaDto } from './dto/responder-tentativa.dto.js';
import { TentativasSalaRepository } from './tentativas_sala.repository.js';
import { UpdateTentativasDto } from './dto/update-tentativas_sala.dto.js';

@Injectable()
export class TentativasSalaService {
  constructor(private readonly repository: TentativasSalaRepository) {}

  async create(data : CreateTentativasDto) {
    if (data.sala_id == null || data.personagem_id == null || data.usuario_id == null || data.personagem_id < 1 || data.usuario_id < 1) {
      throw new BadRequestException('Os IDs da sala, do personagem e do usuário devem ser positivos.');
    }
  }

  async findAll(filtros: FindTentativasQueryDto) {
    return this.repository.listarComFiltrosEPaginacao(filtros);
  }

  async findById(id: number) {
    const tentativa = await this.repository.buscarPorId(id);
    if (!tentativa) {
      throw new NotFoundException('Tentativa de sala não encontrada.');
    }
    return tentativa;
  }

  async update(id: number, data: UpdateTentativasDto) {
    await this.findById(id);

    if (data.personagem_id !== undefined && data.personagem_id !== null) {
      const personagem = await this.repository.buscarPersonagemPorId(data.personagem_id);
      if (!personagem) {
        throw new NotFoundException('Personagem informado não foi encontrado.');
      }
    }

    if (data.sala_id !== undefined && data.sala_id !== null) {
      const sala = await this.repository.buscarSalaPorId(data.sala_id);
      if (!sala) {
        throw new NotFoundException('Sala de desafio informada não foi encontrada.');
      }
    }

    if (data.vida_restante !== undefined) {
      data.vida_restante = Math.min(data.vida_restante, 100);
    }

    return this.repository.atualizar(id, data);
  }

  async remove(id: number) {
    await this.findById(id);
    await this.repository.remover(id);
    return { mensagem: 'Tentativa de sala removida com sucesso.' };
  }

  async CalcularDanoBaseadoNaEspecializacao(data: ResponderTentativaDto): Promise<Number> {
    
    const personagem = await this.repository.buscarPersonagemPorId(data.personagem_id);
    
    if (!personagem) {
      throw new NotFoundException('Personagem informado não foi encontrado.');
    }
    if (personagem.especializacao_id == null) {
      throw new BadRequestException('O personagem não possui especialização.');
    }
    
    const ranking = personagem?.rank_id;
    
    if(ranking == null || !ranking ){
      throw new BadRequestException('O personagem não possui ranking definido.');
    }

    const especilizacaoDoUsuario = await this.repository.buscarEspecializacaoPorId(personagem.especializacao_id);
    const questao = await this.repository.buscarQuestaoPorId(data.questao_id);
    let dano = 5 * ranking;

    if (!questao) {
      throw new NotFoundException('Questão informada não foi encontrada.');
    }
    
    if(especilizacaoDoUsuario?.atributo_penalidade === questao.topico_atributo){
      if(data.alternativa_escolhida !== questao.resposta_correta){
        dano = dano * 2;
        throw {message: 'Resposta errada, você recebeu uma penalidade de dobro de dano'};
      }
      else{
        dano = 0
        throw {message: 'Resposta correta, sem penalidade de dano.'};
      }
    }
    return dano;
  }

  async LogicaJogo(data: ResponderTentativaDto){
    const personagem = await this.repository.buscarPersonagemPorId(data.personagem_id);
    const sala = await this.repository.buscarSalaPorId(data.sala_id);
    let id = data.questao_id;
    let xpAtual = Number(personagem?.xp_atual ?? 0);
    let moedas = Number(personagem?.moedas ?? 0);
    let ranking =  Number(personagem?.rank_id);

    const jaPassouNessaSala = await this.repository.verificarSeJaFezAFase(data.personagem_id, data.sala_id);
    if (jaPassouNessaSala) {
      throw ('Esta sala já foi concluida');
    }

    if (ranking < Number(sala?.rank_minimo_id)) {
      throw ('Nível/Ranking insuficiente para acessar esta sala!');
    }

    if (data.tipo_status_tentativas === 'DERROTA') {
      if ((sala?.chefe_nome)?.includes('Diego')) {
        await this.repository.deletarInventarioDoPersonagemId(data.personagem_id);
        throw('O Boss Diego derrotou você e destruiu seus itens!');
      }

      return {message: 'Você foi derrotado'};
    }

    while (data.tipo_status_tentativas === 'EM_ANDAMENTO'){
      let dano = Number(this.CalcularDanoBaseadoNaEspecializacao(data));
      this.verificaSeUsuarioEstaVivo(data, dano);
      const questao = await this.repository.buscarQuestaoPorId(id);  
      id++;
    }

    if(data.tipo_status_tentativas === 'VITORIA'){
      xpAtual += Number(sala?.xp_recompensa);
      moedas += Number(sala?.moedas_recompensa);
      ranking = await this.checkSeUpou(xpAtual);
      await this.repository.atualizarPersonagem(data.personagem_id, xpAtual, moedas, ranking);
      return {message: 'Parabéns você venceu a fase'}
    }

    if((sala?.chefe_nome)?.includes('Diego')) {
      await this.repository.deletarInventarioDoPersonagemId(data.personagem_id);
      console.log("O Boss deletou seus itens")
    }
  }
    
  async checkSeUpou(xp: number){
    if(xp >= 100 ){
      return 2;
    }
    if(xp >= 200 ){
      return 3;
    }
    if(xp >= 300 ){
      return 4;
    }
    return 1;  
  }

  async verificaSeUsuarioEstaVivo(data: ResponderTentativaDto, dano: number){
    let vidaAtual = data.vida_restante - dano;
    
    if(vidaAtual <= 0){
      data.tipo_status_tentativas = 'DERROTA'
    }

    if(vidaAtual > 100){
      vidaAtual = 100;
      console.log({message: 'Você atingiu a vida máxima, sua vida retornou a 100'});
    }
    data.vida_restante = vidaAtual;
    return this.repository.atualizar(data.id, data); 
  }

  async respostaUsuario(data: ResponderTentativaDto){
    const personagem = await this.repository.buscarPersonagemPorId(data.personagem_id);

    if (!personagem) {
      throw new NotFoundException('Personagem informado não foi encontrado.');
    }

    return this.LogicaJogo(data);
  }
}

