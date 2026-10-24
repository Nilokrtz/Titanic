import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import argon2 from 'argon2';

const urlBanco = process.env.DATABASE_URL;

if (!urlBanco) {
  throw new Error('DATABASE_URL não configurada.');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: urlBanco }),
});

async function main(){
  console.log('Iniciando povoamento do banco de dados')

  const perfilAdmin = await prisma.perfis.upsert({
    where: { nome: 'ADMIN_PROFESSOR' },
    update: {},
    create: { nome: 'ADMIN_PROFESSOR', descricao: 'Administrador do Sistema' },
  });

  const perfilAluno = await prisma.perfis.upsert({
    where: { nome: 'ALUNO' },
    update: {},
    create: { nome: 'ALUNO', descricao: 'Perfil de Jogador'},
  });

  const perfilMonitor = await prisma.perfis.upsert({
    where: { nome: 'MONITOR' },
    update: {},
    create: { nome: 'MONITOR', descricao: 'Perfil de Monitor' },
  });

  const permissaoGeral = await prisma.permissoes.upsert({
    where: { slug: 'ACESSO_GERAL' },
    update: {},
    create: { slug: 'ACESSO_GERAL', descricao: 'Permissão de acesso geral'}
  });

  await prisma.perfis_permissoes.upsert({
    where: {
      perfil_id_permissao_id: {
        perfil_id: perfilAdmin.id,
        permissao_id: permissaoGeral.id,
      },
    },
    update: {},
    create: {
      perfil_id: perfilAdmin.id,
      permissao_id: permissaoGeral.id,
    },
  });

  const especializacaoDev = await prisma.especializacoes.upsert({
    where: { nome: 'back_end' },
    update: {},
    create: {
      nome: 'back_end',
      descricao: 'Especialista em APIs e Regras de Negócio',
      atributo_foco: 'back_end',
      atributo_penalidade: 'front_end',
    },
  });

  const rankEstagiario = await prisma.ranks.upsert({
    where: { nivel_acesso: 1 },
    update: {},
    create: {
      nome: 'Estagiário',
      nivel_acesso: 1,
      xp_minimo: 0,
    },
  });

   const rankJunior = await prisma.ranks.upsert({
    where: { nivel_acesso: 2 },
    update: {},
    create: {
      nome: 'Júnior',
      nivel_acesso: 2,
      xp_minimo: 100,
    },
  });

  const rankPleno = await prisma.ranks.upsert({
    where: { nivel_acesso: 3 },
    update: {},
    create: {
      nome: 'Pleno',
      nivel_acesso: 3,
      xp_minimo: 200,
    },
  });

  const rankSenior = await prisma.ranks.upsert({
    where: { nivel_acesso: 4 },
    update: {},
    create: {
      nome: 'Senior',
      nivel_acesso: 4,
      xp_minimo: 300,
    },
  });

  const senhaNiloHash = await argon2.hash('senhanilo');
  const senhaAdminHash = await argon2.hash('senhaadmin');
  const senhaMonitorHash = await argon2.hash('senhamonitor');

  const usuarioTeste = await prisma.usuarios.upsert({
    where: { email: 'nilo@cefet.br' },
    update: {
      senha: senhaNiloHash,
      perfil_id: perfilAluno.id,
      refresh_token_hash: null,
      excluido_em: null,
    },
    create: {
      email: 'nilo@cefet.br',
      senha: senhaNiloHash,
      perfil_id: perfilAluno.id,
    },
  })

  const usuarioAdmin = await prisma.usuarios.upsert({
    where: { email: 'admin@cefet.br' },
    update: {
      senha: senhaAdminHash,
      perfil_id: perfilAdmin.id,
      refresh_token_hash: null,
      excluido_em: null,
    },
    create: {
      email: 'admin@cefet.br',
      senha: senhaAdminHash,
      perfil_id: perfilAdmin.id,
    },
  });

  await prisma.usuarios.upsert({
    where: { email: 'monitor@cefet.br' },
    update: {
      senha: senhaMonitorHash,
      perfil_id: perfilMonitor.id,
      refresh_token_hash: null,
      excluido_em: null,
    },
    create: {
      email: 'monitor@cefet.br',
      senha: senhaMonitorHash,
      perfil_id: perfilMonitor.id,
    },
  });

  const personagemHeroi = await prisma.personagens.upsert({
    where: { nome: 'DevMaster' },
    update: {},
    create: {
      nome: 'DevMaster',
      usuario_id: usuarioTeste.id,
      especializacao_id: especializacaoDev.id,
      rank_id: rankEstagiario.id,
      xp_atual: 0,
      vida_maxima: 100,
      vida_atual: 100,
      moedas: 0,
    },
  });

  const itemPocao = await prisma.itens.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nome: 'Poção de Vida',
      descricao: 'Recupera 30 pontos de vida durante o quiz',
      tipo_efeito: 'CURA',
      valor_efeito: 30,
      preco_moedas: 15,
    },
  });

  await prisma.inventario_itens.upsert({
    where: { id: 1 },
    update: {},
    create: {
      personagem_id: personagemHeroi.id,
      item_id: itemPocao.id,
      quantidade: 2,
    },
  });

  const sala1 = await prisma.salas_desafio.upsert({
    where: {numero_sala: 316},
    update: {},
    create: {
      numero_sala: 316,
      nome: 'Sala - Foco(Back-end)',
      chefe_nome: 'Eduardo',
      materia_foco: 'back_end',
      xp_recompensa: 100,
      moedas_recompensa: 50,
      dano_base_erro: 10,
      rank_minimo_id: rankEstagiario.id,
    },
  });

  const sala2 = await prisma.salas_desafio.upsert({
    where: {numero_sala: 317},
    update: {},
    create: {
      numero_sala: 317,
      nome: 'Sala - Foco(seguranca)',
      chefe_nome: 'Emilio',
      materia_foco: 'seguranca',
      xp_recompensa: 50,
      moedas_recompensa: 50,
      dano_base_erro: 15,
      rank_minimo_id: rankJunior.id,
    },
  });

  const questao1 = await prisma.quiz_questoes.upsert({
    where: { id: 1 },
    update: {},
    create: {
      sala_id: sala1.id,
      topico_atributo: 'back_end',
      enunciado: 'Qual método HTTP é utilizado para criação de novos recursos?',
      opcao_a: 'GET',
      opcao_b: 'POST',
      opcao_c: 'DELETE',
      opcao_d: 'PUT',
      resposta_correta: 'B',
      dica_texto: 'Pensar na ação de postar/enviar novos dados.',
    },
  });

  await prisma.tentativas_sala.upsert({
    where: { id: 1 },
    update: {},
    create: {
      sala_id: sala1.id,
      personagem_id: personagemHeroi.id,
      questao_atual_id: questao1.id,
      status: 'EM_ANDAMENTO',
      vida_restante: 100,
      acertos: 0,
      erros: 0,
      pulos_restantes: 1,
    },
  });

  console.log('Povoamento completo concluído com sucesso!');


const conquistasIniciais = [
  {
    nome: 'Em busca do trabalho infinito',
    descricao: 'Parabens voce finalmente completou a sala do Eevee',
    recompensa: 50 ,
  },

{
  nome: 'Diploma Desbloqueado (Ou quase...)',
  descricao: 'Derrotou o Final Boss e concluiu sem trancar o curso...',
  recompensa: 150,
},
{
  nome: 'MegaBrain Unlocked',
  descricao: 'Parabens voce zerou o jogo sem errar nenhuma questao, voce tem um verdadeiro Big Brain',
  recompensa: 300,
},
{
  nome: 'Voce e um Muquirana',
  descricao: 'Parabens atingiu o maximo de moedas possiveis sem gastar nada',
  recompensa: 150,
},
{
  nome: 'O Mestre dos Monitores',
  descricao: 'Parabens voce derrotou todos os monitores',
  recompensa: 100,
}


];

for (const conquista of conquistasIniciais) {
  await prisma.conquistas.upsert({
    where: { nome: conquista.nome },
    update: {},
    create: conquista,
  });
}
}
main()
  .catch((e) =>{
    console.error('Erro durante a execução do seed: ', e);
    process.exit(1);
  })
  .finally(async () =>{
    await prisma.$disconnect();
  });

  await prisma.cassino.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nome: 'Sem Sorte',
      tipo_recompensa: 'NADA',
      valor_recompensa: 0,
      chance_porcentagem: 50,
      descricao: 'Você perdeu a aposta',
    },
  });

  await prisma.cassino.upsert({
    where: { id: 2 },
    update: {},
    create: {
      nome: 'Consolação',
      tipo_recompensa: 'MOEDAS',
      valor_recompensa: 10,
      chance_porcentagem: 20,
      descricao: 'Recupera 10 moedas da aposta',
    },
  });

  await prisma.cassino.upsert({
    where: { id: 3 },
    update: {},
    create: {
      nome: 'Dobro de moedas',
      tipo_recompensa: 'MOEDAS',
      valor_recompensa: 40,
      chance_porcentagem: 15,
      descricao: 'Dobra o valor apostado',
    },
  });

  await prisma.cassino.upsert({
    where: { id: 4 },
    update: {},
    create: {
      nome: 'Sorteio de Item',
      tipo_recompensa: 'ITEM',
      valor_recompensa: 0,
      chance_porcentagem: 15,
      descricao: 'Ganha 1 item aleatório',
    },
  });