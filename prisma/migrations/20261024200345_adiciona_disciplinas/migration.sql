-- AlterTable
ALTER TABLE "salas_desafio" ADD COLUMN     "disciplina_id" INTEGER;

-- CreateTable
CREATE TABLE "disciplinas" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "descricao" VARCHAR(255),
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "disciplinas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "disciplinas_nome_key" ON "disciplinas"("nome");

-- AddForeignKey
ALTER TABLE "salas_desafio" ADD CONSTRAINT "salas_desafio_disciplina_id_fkey" FOREIGN KEY ("disciplina_id") REFERENCES "disciplinas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
