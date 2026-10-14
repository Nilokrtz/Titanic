import { ApiProperty } from '@nestjs/swagger';
import { PerfilRespostaDto } from './perfil-resposta.dto.js';

export class ListarPerfisRespostaDto {
  @ApiProperty({ type: [PerfilRespostaDto] })
  items: PerfilRespostaDto[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 3 })
  total: number;
}
