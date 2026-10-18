import { ApiProperty } from '@nestjs/swagger';

export class PersonagemRespostaDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'DevMaster' })
  nome: string;

  @ApiProperty({ type: Number, nullable: true, example: 1 })
  usuario_id: number | null;

  @ApiProperty({ type: Number, nullable: true, example: 1 })
  especializacao_id: number | null;

  @ApiProperty({ type: Number, nullable: true, example: 1 })
  rank_id: number | null;

  @ApiProperty({ type: Number, nullable: true, example: 0 })
  xp_atual: number | null;

  @ApiProperty({ type: Number, nullable: true, example: 100 })
  vida_maxima: number | null;

  @ApiProperty({ type: Number, nullable: true, example: 100 })
  vida_atual: number | null;

  @ApiProperty({ type: Number, nullable: true, example: 0 })
  moedas: number | null;
}
