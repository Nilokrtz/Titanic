import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { tipo_perfil } from '../../generated/prisma/enums.js';

export class ListarPerfisDto {
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

  @ApiPropertyOptional({ enum: tipo_perfil })
  @IsOptional()
  @IsEnum(tipo_perfil)
  nome?: tipo_perfil;

  @ApiPropertyOptional({
    description: 'Trecho da descrição, sem diferenciar maiúsculas e minúsculas',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  descricao?: string;
}
