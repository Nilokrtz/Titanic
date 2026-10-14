import { ApiProperty } from '@nestjs/swagger';

export class LoginRespostaDto {
  @ApiProperty({ description: 'Token de acesso JWT' })
  access_token: string;

  @ApiProperty({ enum: ['Bearer'] })
  token_type: 'Bearer';

  @ApiProperty({ example: 900, description: 'Validade em segundos' })
  expires_in: number;
}
