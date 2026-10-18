import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreatePersonagenDto {
@ApiProperty({
    type: 'string',
    maxLength: 80,
    description: 'Nome único do personagem',
    example: 'DevMaster',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  nome: string;

  @ApiPropertyOptional({
    type: 'integer',
    minimum: 1,
    description: 'ID da especialização do personagem',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  especializacao_id?: number;

  @ApiPropertyOptional({
    type: 'integer',
    minimum: 1,
    description: 'ID do rank/senioridade do personagem',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  rank_id?: number;

  @ApiPropertyOptional({
    type: 'integer',
    minimum: 0,
    description: 'Experiência atual acumulada pelo personagem',
    example: 0,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  xp_atual?: number;

  @ApiPropertyOptional({
    type: 'integer',
    minimum: 1,
    description: 'Quantidade máxima de vida do personagem',
    example: 100,
    default: 100,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  vida_maxima?: number;

  @ApiPropertyOptional({
    type: 'integer',
    minimum: 0,
    description: 'Quantidade de vida atual do personagem',
    example: 100,
    default: 100,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  vida_atual?: number;

  @ApiPropertyOptional({
    type: 'integer',
    minimum: 0,
    description: 'Quantidade de moedas do personagem (não pode ser negativa)',
    example: 50,
    default: 50,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  moedas?: number;
}