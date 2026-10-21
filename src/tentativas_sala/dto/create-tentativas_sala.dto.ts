import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { tipo_status_tentativa } from '../../generated/prisma/client.js';

export class CreateTentativasDto {
  @ApiPropertyOptional({ description: 'ID da sala de desafio', example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  sala_id?: number;

  @ApiPropertyOptional({ description: 'ID do personagem que realiza a tentativa', example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  personagem_id?: number;

  @ApiPropertyOptional({ description: 'ID do personagem que realiza a tentativa', example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  usuario_id?: number;

  @ApiPropertyOptional({ description: 'ID da questão atual do quiz', example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  questao_atual_id?: number;

  @ApiProperty({ description: 'Vida atual do personagem na tentativa', example: 100 })
  @IsInt()
  @Min(0)
  vida_restante: number;

  @ApiPropertyOptional({description: 'Status da tentativa',enum: tipo_status_tentativa,example: 'EM_ANDAMENTO'})
  @IsOptional()
  @IsEnum(tipo_status_tentativa)
  status?: tipo_status_tentativa;

  @ApiPropertyOptional({ description: 'Quantidade de acertos', example: 0, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  acertos?: number;

  @ApiPropertyOptional({ description: 'Quantidade de erros', example: 0, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  erros?: number;

  @ApiPropertyOptional({ description: 'Quantidade de pulos restantes', example: 1, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  pulos_restantes?: number;
}