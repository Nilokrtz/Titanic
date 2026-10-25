import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class FindSalasQueryDto {
  @ApiPropertyOptional({ description: 'Filtro parcial pelo nome da sala', example: 'Masmorra' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional({ description: 'Filtro por matéria/área de foco', example: 'back_end' })
  @IsOptional()
  @IsString()
  materia_foco?: string;

  @ApiPropertyOptional({ description: 'Filtro por ID do rank mínimo exigido', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  rank_minimo_id?: number;

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