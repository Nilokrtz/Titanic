import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min} from 'class-validator';


export class CreateItenDto {
  @ApiProperty({ example: 'Cartas (Elimina 2)'})
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nome: string;

  @ApiPropertyOptional({ example: 'Elimina 2 alternativas incorretas da questao atual'})
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiPropertyOptional({ example: 'ELIMINAR_DUAS'})
  @IsOptional()
  @IsString()
  @MaxLength(40)
  tipo_efeito?: string

  @ApiPropertyOptional({ example: 2})
  @IsOptional()
  @IsInt()
  @Min(0)
  valor_efeito?: number;

  @ApiProperty({ example: 25})
  @IsInt()
  @Min(0)
  preco_moedas: number;

}
