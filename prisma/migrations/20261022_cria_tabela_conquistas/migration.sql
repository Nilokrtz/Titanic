CREATE TABLE "conquistas" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "descricao" VARCHAR(200),
    "recompensa" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "conquistas_pkey" PRIMARY KEY ("id")
)

CREATE UNIQUE INDEX "conquistas_nome_key" ON "conquistas" ("nome");