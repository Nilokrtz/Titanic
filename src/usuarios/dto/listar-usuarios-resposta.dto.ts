import { ApiProperty } from '@nestjs/swagger';
import { UsuarioRespostaDto } from './usuario-resposta.dto.js';

export class ListarUsuariosRespostaDto {
  @ApiProperty({ type: [UsuarioRespostaDto] })
  items: UsuarioRespostaDto[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 3 })
  total: number;
}
