import { ApiProperty } from '@nestjs/swagger';
import { PersonagemRespostaDto } from './personagem-resposta.dto.js';

export class ListarPersonagensRespostaDto {
  @ApiProperty({ type: [PersonagemRespostaDto] })
  items: PersonagemRespostaDto[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 3 })
  total: number;
}
