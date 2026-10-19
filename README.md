# RPG academico

Esta é a API do nosso RPG acadêmico. O aluno cria um personagem, entra em salas de desafio, responde questões de quizes e ganha XP e moedas. A API também cuida das contas, dos perfis e dos itens do jogo.

## Contas de teste

O seed cria estas contas para testar os três perfis:

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Professor | `admin@cefet.br` | `senhaadmin` |
| Monitor | `monitor@cefet.br` | `senhamonitor` |
| Aluno | `nilo@cefet.br` | `senhanilo` |

## Email de boas-vindas

O cadastro envia um email de boas-vindas pelo Gmail. Para isso, ative a verificação em duas etapas na conta que vai enviar as mensagens e crie uma senha de app. No `.env`, coloque o endereço dessa conta em `SMTP_USER` e a senha de app em `SMTP_APP_PASSWORD`. Não use a senha normal do Gmail. Essas duas variáveis também são usadas quando a API roda no Docker.

Se o envio falhar, o cadastro continua salvo. Veja o erro no log da API para corrigir a configuração antes do próximo teste.

##  instalação usando um PostgreSQL instalado na máquina

1. Instale o Node.js e o PostgreSQL. Crie no PostgreSQL um banco vazio chamado `rpg_academico`.
2. Na pasta do projeto, rode `npm install`.
3. Copie `.env.example` para `.env`. No `.env`, coloque a conexão do seu PostgreSQL em `DATABASE_URL` e escolha valores diferentes para `JWT_SECRET` e `JWT_REFRESH_SECRET`. Um exemplo de conexão local é `postgresql://postgres:SUA_SENHA@localhost:5432/rpg_academico`.
4. Para usar o cache do ranking, inicie um Redis na porta 6379. Se tiver Docker, pode rodar `docker compose up -d redis`. Sem Redis, o ranking continua consultando o banco normalmente.
5. Rode os comandos abaixo, nessa ordem:

```bash
npx prisma migrate deploy
npx prisma generate
npm run db:seed
npm run start:dev
```

As migrations criam as tabelas e o seed coloca os dados iniciais, incluindo as contas de teste. Depois, abra o Swagger em http://localhost:3000/api.

## Usando Docker

Nesse caminho, basta ter o Docker. Não precisa instalar o PostgreSQL nem o Node.js na máquina.

1. Na pasta do projeto, copie `.env.example` para `.env`. Troque `JWT_SECRET` e `JWT_REFRESH_SECRET` por duas chaves longas e diferentes. O Docker Compose configura a conexão com o banco, então não precisa alterar `DATABASE_URL` para esse caminho.
2. Rode:

```bash
docker compose up --build -d
docker compose exec api npm run db:seed
```

O primeiro comando sobe a API, o PostgreSQL e o Redis e aplica as migrations, depois ele popula um banco novo com os dados iniciais. Depois, abra o Swagger em http://localhost:3000/api.

O Redis guarda por 30 segundos os resultados de `GET /personagens/ranking/xp`, `GET /salas`, `GET /salas/:id`, `GET /itens`, `GET /ranks` e `GET /questoes`. 
Quando um professor chama algum endpoint, o cache correspondente é limpo. Se o Redis estiver fora do ar as consultas continuam pelo PostgreSQL.
