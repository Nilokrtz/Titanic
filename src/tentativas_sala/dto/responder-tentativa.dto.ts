import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsIn, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class ResponderTentativaDto {
  
  @ApiProperty({ description: 'ID da tentativa', example: 1 })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  id: number;

  @ApiProperty({ description: 'ID da questão a ser respondida', example: 10 })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  questao_id: number;

  @ApiProperty({ description: 'Alternativa escolhida (A, B, C ou D)', example: 'A' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['A', 'B', 'C', 'D'])
  alternativa_escolhida: string;
} 