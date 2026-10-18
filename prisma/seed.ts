import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

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

  await prisma.perfis.upsert({
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

  const usuarioTeste = await prisma.usuarios.upsert({
    where: { email: 'nilo@cefet.br' },
    update: {},
    create: {
    email: 'nilo@cefet.br',
    senha: 'senhanilo',
    perfil_id: perfilAluno.id,
    },
  })

  const usuarioAdmin = await prisma.usuarios.upsert({
    where: { email: 'admin@cefet.br' },
    update: {},
    create: {
      email: 'admin@cefet.br',
      senha: 'senhaadmin', 
      perfil_id: perfilAdmin.id,
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
      moedas_recompensa: 20,
      dano_base_erro: 15,
      rank_minimo_id: rankEstagiario.id,
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
}

main()
  .catch((e) =>{
    console.error('Erro durante a execução do seed: ', e);
    process.exit(1);
  })
  .finally(async () =>{
    await prisma.$disconnect();
  });
