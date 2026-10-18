import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { tipo_status_tentativa } from '../../generated/prisma/client.js';

export class FindTentativasQueryDto {
  @ApiPropertyOptional({ description: 'Filtro por ID do personagem', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  personagem_id?: number;

  @ApiPropertyOptional({ description: 'Filtro por ID da sala de desafio', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  sala_id?: number;

  @ApiPropertyOptional({ description: 'Filtro por status da tentativa', enum: tipo_status_tentativa })
  @IsOptional()
  @IsEnum(tipo_status_tentativa)
  status?: tipo_status_tentativa;

  @ApiPropertyOptional({ description: 'Número da página (padrão: 1)', example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Quantidade de itens por página (padrão: 10)', example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}