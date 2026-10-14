import { ApiProperty } from '@nestjs/swagger';

export class PerfilRespostaDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ enum: ['ADMIN_PROFESSOR', 'MONITOR', 'ALUNO'] })
  nome: 'ADMIN_PROFESSOR' | 'MONITOR' | 'ALUNO';

  @ApiProperty({ example: 'Perfil de aluno', nullable: true })
  descricao: string | null;
}
