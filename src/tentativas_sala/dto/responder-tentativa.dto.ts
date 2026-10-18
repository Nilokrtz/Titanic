import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class ResponderTentativaDto {
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

  @ApiProperty({ description: 'Alternativa escolhida (A, B, C ou D)', example: 'A' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['A', 'B', 'C', 'D', 'a', 'b', 'c', 'd'])
  alternativa_escolhida: string;

  @ApiProperty({ description: 'Número da fase/rodada atual', example: 1 })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  fase: number;
}