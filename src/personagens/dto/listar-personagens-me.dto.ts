import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class ListarPersonagensMeDto {
  @ApiPropertyOptional({
    example: 1,
    default: 1,
    description: 'Número da página',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    description: 'Quantidade de registros por página',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @ApiPropertyOptional({
    example: 'Dev',
    description: 'Filtrar pelo nome do personagem',
  })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  nome?: string;

  @ApiPropertyOptional({
    example: 2,
    description: 'Filtrar pelo ID da especialização',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  especializacao_id?: number;
}