import { ApiProperty } from '@nestjs/swagger';

export class LoginRespostaDto {
  @ApiProperty({ description: 'Token de acesso JWT' })
  access_token: string;

  @ApiProperty({ description: 'Token usado para renovar a sessão' })
  refresh_token: string;

  @ApiProperty({ enum: ['Bearer'] })
  token_type: 'Bearer';

  @ApiProperty({ example: 900, description: 'Validade em segundos' })
  expires_in: number;

  @ApiProperty({
    example: 604800,
    description: 'Validade do refresh token em segundos',
  })
  refresh_expires_in: number;
}
