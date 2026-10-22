import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsIn, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class ResponderTentativaDto {
  
  @ApiProperty({ description: 'ID da tentativa', example: 1 })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  id: number;
  
  @ApiProperty({ description: 'ID do personagem que realiza a tentativa', example: 1 })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  personagem_id: number;

  @ApiProperty({ description: 'ID da questão a ser respondida', example: 10 })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  questao_id: number;

  @ApiProperty({ description: 'ID da sala', example: 10 })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  sala_id: number;

  @ApiProperty({ description: 'Alternativa escolhida (A, B, C ou D)', example: 'A' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['A', 'B', 'C', 'D'])
  alternativa_escolhida: string;

  @ApiProperty({ description: 'Número da fase/rodada atual', example: 1 })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  fase: number;

  @ApiProperty({ description: 'vida do usuário', example: 100 })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  vida_restante: number;

  @ApiProperty({ description: 'Status da tentativa', example: 'EM_ANDAMENTO' })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['EM_ANDAMENTO', 'CONCLUIDA', 'DERROTA'])
  tipo_status_tentativas: string;
} 