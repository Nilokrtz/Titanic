import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min} from 'class-validator';


export class CreateItenDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  tipo_efeito?: string

  @IsOptional()
  @IsInt()
  @Min(0)
  valor_efeito?: number;

  @IsInt()
  @Min(0)
  preco_moedas: number;

}
