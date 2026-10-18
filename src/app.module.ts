import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter.js';
import { AuthModule } from './auth/auth.module.js';
import { UsuariosModule } from './usuarios/usuarios.module.js';
import { PerfisModule } from './perfis/perfis.module.js';
import { RanksModule } from './ranks/ranks.module.js';
import { PersonagensModule } from './personagens/personagens.module.js';
import { ItensModule } from './itens/itens.module.js';
import { InventarioItensModule } from './inventario_itens/inventario_itens.module.js';
import { SalasDesafioModule } from './salas_desafio/salas_desafio.module.js';
import { QuizQuestoesModule } from './quiz_questoes/quiz_questoes.module.js';
import { TentativasSalaModule } from './tentativas_sala/tentativas_sala.module.js';
import { EspecializacoesModule } from './especializacoes/especializacoes.module.js';
import { EventosModule } from './eventos/eventos.module.js';

@Module({
  imports: [AuthModule, UsuariosModule, PerfisModule, RanksModule, PersonagensModule, ItensModule, InventarioItensModule, SalasDesafioModule, QuizQuestoesModule, TentativasSalaModule, EspecializacoesModule, EventosModule],
  controllers: [AppController],
  providers: [AppService, { provide: APP_FILTER, useClass: PrismaExceptionFilter }],
})
export class AppModule {}
