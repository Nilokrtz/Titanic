import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Matches, Min } from 'class-validator';
import { tipo_topico_questao } from '../../generated/prisma/client.js';

export class CreateQuizQuestoesDto {
  @ApiProperty({ description: 'ID da sala de desafio vinculada', example: 1 })
  @IsInt()
  @Min(1)
  sala_id: number;

  @ApiProperty({description: 'Tópico ou atributo técnico da questão',enum: tipo_topico_questao,example: 'back_end'})
  @IsEnum(tipo_topico_questao)
  topico_atributo: tipo_topico_questao;

  @ApiProperty({ description: 'Texto do enunciado da questão', example: 'Qual é o padrão do Prisma ORM para mapear tabelas?' })
  @IsString()
  @IsNotEmpty()
  enunciado: string;

  @ApiProperty({ description: 'Texto da opção A', example: 'Data Mapper' })
  @IsString()
  @IsNotEmpty()
  opcao_a: string;

  @ApiProperty({ description: 'Texto da opção B', example: 'Active Record' })
  @IsString()
  @IsNotEmpty()
  opcao_b: string;

  @ApiProperty({ description: 'Texto da opção C', example: 'Repository Pattern' })
  @IsString()
  @IsNotEmpty()
  opcao_c: string;

  @ApiProperty({ description: 'Texto da opção D', example: 'Query Builder' })
  @IsString()
  @IsNotEmpty()
  opcao_d: string;

  @ApiProperty({ description: 'Letra da resposta correta (A, B, C ou D)', example: 'A' })
  @IsString()
  @Matches(/^[A-D]$/, { message: 'A resposta correta deve ser exatamente A, B, C ou D.' })
  resposta_correta: string;

  @ApiPropertyOptional({ description: 'Dica de texto opcional', example: 'Pense em como o Prisma isola as entidades.' })
  @IsOptional()
  @IsString()
  dica_texto?: string;
}