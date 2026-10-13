import { ApiProperty } from '@nestjs/swagger';

export class RegistrarRespostaDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'aluno@exemplo.com' })
  email: string;

  @ApiProperty({ enum: ['ALUNO'] })
  perfil: 'ALUNO';
}
