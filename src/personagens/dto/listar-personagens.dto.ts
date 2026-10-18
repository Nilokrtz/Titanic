import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class ListarPersonagensDto {
  @ApiPropertyOptional({ default: 1, minimum: 1, maximum: 1000000 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000000)
  page = 1;

  @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 10;

  @ApiPropertyOptional({ description: 'Trecho do nome do personagem' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  nome?: string;

  @ApiPropertyOptional({ description: 'ID da especialização do personagem' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  especializacao_id?: number;
}
