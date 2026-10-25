import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDisciplinaDto {
  @ApiProperty({
    type: String,
    maxLength: 100,
    description: 'Nome da disciplina',
    example: 'Desenvolvimento Back-end',
  })
  @IsString({ message: 'O nome da disciplina deve ser um texto' })
  @IsNotEmpty({ message: 'O nome da disciplina é obrigatório' })
  @MaxLength(100, {
    message: 'O nome da disciplina não pode ter mais de 100 caracteres',
  })
  nome: string;

  @ApiPropertyOptional({
    type: String,
    maxLength: 255,
    description: 'Descrição da disciplina',
    example: 'Conteúdos de APIs, bancos de dados e regras de negócio.',
  })
  @IsOptional()
  @IsString({ message: 'A descrição da disciplina deve ser um texto' })
  @MaxLength(255, {
    message: 'A descrição da disciplina não pode ter mais de 255 caracteres',
  })
  descricao?: string;

  @ApiPropertyOptional({
    type: Boolean,
    default: true,
    description: 'Indica se a disciplina pode ser vinculada a novas salas',
  })
  @IsOptional()
  @IsBoolean({ message: 'O campo ativo deve ser verdadeiro ou falso' })
  ativo?: boolean;
}
