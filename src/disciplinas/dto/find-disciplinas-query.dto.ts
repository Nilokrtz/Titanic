import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindDisciplinasQueryDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Filtro parcial pelo nome',
    example: 'Back-end',
  })
  @IsOptional()
  @IsString({ message: 'O nome da disciplina deve ser um texto' })
  nome?: string;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Filtro pelo estado da disciplina',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean({ message: 'O campo ativo deve ser verdadeiro ou falso' })
  ativo?: boolean;

  @ApiPropertyOptional({
    type: Number,
    description: 'Número da página',
    default: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'A página deve ser um número inteiro' })
  @Min(1, { message: 'A página mínima é 1' })
  page?: number = 1;

  @ApiPropertyOptional({
    type: Number,
    description: 'Quantidade de itens por página',
    default: 10,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'O limite deve ser um número inteiro' })
  @Min(1, { message: 'O limite mínimo é 1' })
  limit?: number = 10;
}
