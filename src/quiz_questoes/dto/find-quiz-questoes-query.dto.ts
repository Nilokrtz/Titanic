import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { tipo_topico_questao } from '../../generated/prisma/client.js';

export class FindQuizQuestoesQueryDto {
  @ApiPropertyOptional({ description: 'Filtro por ID da sala de desafio', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  sala_id?: number;

  @ApiPropertyOptional({ description: 'Filtro por tópico da questão', enum: tipo_topico_questao })
  @IsOptional()
  @IsEnum(tipo_topico_questao)
  topico_questao?: tipo_topico_questao;

  @ApiPropertyOptional({ description: 'Filtro parcial por texto no enunciado', example: 'Prisma' })
  @IsOptional()
  @IsString()
  enunciado?: string;

  @ApiPropertyOptional({ description: 'Número da página', example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Quantidade por página', example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}