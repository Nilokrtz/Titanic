-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "tipo_especializacao" AS ENUM ('ia', 'seguranca', 'dados', 'front_end', 'back_end');

-- CreateEnum
CREATE TYPE "tipo_perfil" AS ENUM ('ADMIN_PROFESSOR', 'MONITOR', 'ALUNO');

-- CreateEnum
CREATE TYPE "tipo_status_tentativa" AS ENUM ('EM_ANDAMENTO', 'VITORIA', 'DERROTA');

-- CreateEnum
CREATE TYPE "tipo_topico_questao" AS ENUM ('ia', 'seguranca', 'dados', 'front_end', 'back_end', 'logica');

-- CreateTable
CREATE TABLE "especializacoes" (
    "id" SERIAL NOT NULL,
    "nome" "tipo_especializacao" NOT NULL,
    "descricao" TEXT,
    "atributo_foco" "tipo_topico_questao" NOT NULL,
    "atributo_penalidade" "tipo_topico_questao" NOT NULL,

    CONSTRAINT "especializacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventario_itens" (
    "id" SERIAL NOT NULL,
    "personagem_id" INTEGER,
    "item_id" INTEGER,
    "quantidade" INTEGER DEFAULT 1,

    CONSTRAINT "inventario_itens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itens" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "descricao" TEXT,
    "tipo_efeito" VARCHAR(40),
    "valor_efeito" INTEGER,
    "preco_moedas" INTEGER NOT NULL,

    CONSTRAINT "itens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfis" (
    "id" SERIAL NOT NULL,
    "nome" "tipo_perfil" NOT NULL,
    "descricao" VARCHAR(200),

    CONSTRAINT "perfis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfis_permissoes" (
    "perfil_id" INTEGER NOT NULL,
    "permissao_id" INTEGER NOT NULL,

    CONSTRAINT "perfis_permissoes_pkey" PRIMARY KEY ("perfil_id","permissao_id")
);

-- CreateTable
CREATE TABLE "permissoes" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "descricao" VARCHAR(200),

    CONSTRAINT "permissoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personagens" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER,
    "especializacao_id" INTEGER,
    "rank_id" INTEGER,
    "nome" VARCHAR(80) NOT NULL,
    "xp_atual" INTEGER DEFAULT 0,
    "vida_maxima" INTEGER DEFAULT 100,
    "vida_atual" INTEGER DEFAULT 100,
    "moedas" INTEGER DEFAULT 50,

    CONSTRAINT "personagens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_questoes" (
    "id" SERIAL NOT NULL,
    "sala_id" INTEGER,
    "topico_atributo" "tipo_topico_questao" NOT NULL,
    "enunciado" TEXT NOT NULL,
    "opcao_a" VARCHAR(255) NOT NULL,
    "opcao_b" VARCHAR(255) NOT NULL,
    "opcao_c" VARCHAR(255) NOT NULL,
    "opcao_d" VARCHAR(255) NOT NULL,
    "resposta_correta" CHAR(1),
    "dica_texto" TEXT,

    CONSTRAINT "quiz_questoes_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "quiz_questoes_resposta_correta_check" CHECK ("resposta_correta" IN ('A', 'B', 'C', 'D'))
);

-- CreateTable
CREATE TABLE "ranks" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "nivel_acesso" INTEGER NOT NULL,
    "xp_minimo" INTEGER NOT NULL,

    CONSTRAINT "ranks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salas_desafio" (
    "id" SERIAL NOT NULL,
    "rank_minimo_id" INTEGER,
    "numero_sala" INTEGER NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "chefe_nome" VARCHAR(80),
    "materia_foco" VARCHAR(100),
    "xp_recompensa" INTEGER NOT NULL,
    "moedas_recompensa" INTEGER NOT NULL,
    "dano_base_erro" INTEGER NOT NULL,

    CONSTRAINT "salas_desafio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tentativas_sala" (
    "id" SERIAL NOT NULL,
    "sala_id" INTEGER,
    "personagem_id" INTEGER,
    "questao_atual_id" INTEGER,
    "status" "tipo_status_tentativa" DEFAULT 'EM_ANDAMENTO',
    "vida_restante" INTEGER NOT NULL,
    "acertos" INTEGER DEFAULT 0,
    "erros" INTEGER DEFAULT 0,
    "pulos_restantes" INTEGER DEFAULT 1,
    "iniciado_em" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "finalizado_em" TIMESTAMP(6),

    CONSTRAINT "tentativas_sala_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "senha" VARCHAR(255) NOT NULL,
    "refresh_token_hash" VARCHAR(255),
    "perfil_id" INTEGER,
    "criado_em" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "especializacoes_nome_key" ON "especializacoes"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "perfis_nome_key" ON "perfis"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "permissoes_slug_key" ON "permissoes"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "personagens_usuario_id_key" ON "personagens"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "personagens_nome_key" ON "personagens"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "ranks_nome_key" ON "ranks"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "ranks_nivel_acesso_key" ON "ranks"("nivel_acesso");

-- CreateIndex
CREATE UNIQUE INDEX "salas_desafio_numero_sala_key" ON "salas_desafio"("numero_sala");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "inventario_itens" ADD CONSTRAINT "inventario_itens_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "itens"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inventario_itens" ADD CONSTRAINT "inventario_itens_personagem_id_fkey" FOREIGN KEY ("personagem_id") REFERENCES "personagens"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "perfis_permissoes" ADD CONSTRAINT "perfis_permissoes_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "perfis"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "perfis_permissoes" ADD CONSTRAINT "perfis_permissoes_permissao_id_fkey" FOREIGN KEY ("permissao_id") REFERENCES "permissoes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "personagens" ADD CONSTRAINT "personagens_especializacao_id_fkey" FOREIGN KEY ("especializacao_id") REFERENCES "especializacoes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "personagens" ADD CONSTRAINT "personagens_rank_id_fkey" FOREIGN KEY ("rank_id") REFERENCES "ranks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "personagens" ADD CONSTRAINT "personagens_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quiz_questoes" ADD CONSTRAINT "quiz_questoes_sala_id_fkey" FOREIGN KEY ("sala_id") REFERENCES "salas_desafio"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "salas_desafio" ADD CONSTRAINT "salas_desafio_rank_minimo_id_fkey" FOREIGN KEY ("rank_minimo_id") REFERENCES "ranks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tentativas_sala" ADD CONSTRAINT "tentativas_sala_personagem_id_fkey" FOREIGN KEY ("personagem_id") REFERENCES "personagens"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tentativas_sala" ADD CONSTRAINT "tentativas_sala_questao_atual_id_fkey" FOREIGN KEY ("questao_atual_id") REFERENCES "quiz_questoes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tentativas_sala" ADD CONSTRAINT "tentativas_sala_sala_id_fkey" FOREIGN KEY ("sala_id") REFERENCES "salas_desafio"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "perfis"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
