import { ApiProperty } from '@nestjs/swagger';

export class ItemRespostaDto {
  @ApiProperty({ example: 1 })
  id: number; 

  @ApiProperty({ example: 'Cartas (Elimina 2)' })
  nome: string;

  @ApiProperty({ example: 'Elimina 2 alternativas incorretas', nullable: true })
  descricao: string | null;

  @ApiProperty({ example: 'ELIMINAR_DUAS', nullable: true })
  tipo_efeito: string | null;

@ApiProperty({ example: 2, nullable: true })
valor_efeito: number | null;

@ApiProperty({ example: 25 })
preco_moedas: number;
}