import { ApiProperty } from '@nestjs/swagger';

export class UsuarioRespostaDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'aluno@exemplo.com' })
  email: string;

  @ApiProperty({
    enum: ['ADMIN_PROFESSOR', 'MONITOR', 'ALUNO'],
    nullable: true,
  })
  perfil: 'ADMIN_PROFESSOR' | 'MONITOR' | 'ALUNO' | null;
}
