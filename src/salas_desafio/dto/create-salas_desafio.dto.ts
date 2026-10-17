import {IsString,IsNotEmpty,IsInt,IsOptional,Min,MaxLength} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSalasDesafioDto {
  @ApiProperty({type: 'integer',minimum: 1,description: 'Número único identificador da sala',example: 101})
  @IsInt()
  @Min(1)
  numero_sala: number;

  @ApiProperty({type: 'string',maxLength: 100,description: 'Nome da sala de desafio',example: 'Masmorra de Web'})
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nome: string;

  @ApiPropertyOptional({type: 'string',maxLength: 80,description: 'Nome do chefe/boss da sala',example: 'Diego o Corrompido'})
  @IsOptional()
  @IsString()
  @MaxLength(80)
  chefe_nome?: string;

  @ApiPropertyOptional({type: 'string',maxLength: 100,description: 'Matéria/tópico de TI focado na sala',example: 'ORMs: Sequelize, Drizzle, TypeORM'})
  @IsOptional()
  @IsString()
  @MaxLength(100)
  materia_foco?: string;

  @ApiProperty({type: 'integer',minimum: 0,description: 'Recompensa de XP ao completar a sala',example: 67})
  @IsInt()
  @Min(0)
  xp_recompensa: number;

  @ApiProperty({type: 'integer',minimum: 0,description: 'Recompensa em moedas ao completar a sala',example: 100})
  @IsInt()
  @Min(0)
  moedas_recompensa: number;

  @ApiProperty({type: 'integer',minimum: 0,description: 'Dano base sofrido pelo jogador ao errar uma questão',example: 22})
  @IsInt()
  @Min(0)
  dano_base_erro: number;

  @ApiPropertyOptional({type: 'integer',minimum: 1,description: 'ID do rank mínimo necessário para acessar a sala',example: 2})
  @IsOptional()
  @IsInt()
  @Min(1)
  rank_minimo_id?: number;
}