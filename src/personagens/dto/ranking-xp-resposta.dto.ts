import { ApiProperty } from '@nestjs/swagger';

export class RankingItemDto {
  @ApiProperty({ example: 1, description: 'Posição no ranking' })
  posicao: number;

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

  @ApiProperty({ type: Number, nullable: true, example: 250 })
  xp_atual: number | null;

  @ApiProperty({ type: Number, nullable: true, example: 100 })
  vida_maxima: number | null;

  @ApiProperty({ type: Number, nullable: true, example: 100 })
  vida_atual: number | null;

  @ApiProperty({ type: Number, nullable: true, example: 50 })
  moedas: number | null;

  @ApiProperty({
    example: { id: 1, nome: 'back_end' },
    nullable: true,
  })
  especializacoes?: {
    id: number;
    nome: string;
  } | null;

  @ApiProperty({
    example: { id: 1, nome: 'Estagiário', nivel_acesso: 1 },
    nullable: true,
  })
  ranks?: {
    id: number;
    nome: string;
    nivel_acesso: number;
  } | null;
}

export class RankingXpRespostaDto {
  @ApiProperty({ type: [RankingItemDto] })
  items: RankingItemDto[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 50 })
  total: number;

  @ApiProperty({ example: 5 })
  total_paginas: number;
}

