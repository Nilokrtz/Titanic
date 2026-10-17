import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class ListarUsuariosDto {
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

  @ApiPropertyOptional({ description: 'ID do perfil do usuário' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  perfil_id?: number;

  @ApiPropertyOptional({ description: 'Trecho do email do usuário' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  email?: string;
}
