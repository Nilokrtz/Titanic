import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min, Max, isNotEmpty, isString } from "class-validator";

export class CreateCassinoDto {
    @ApiProperty({
        type: String,
        maxLength: 50,
        description: 'Nome da opção na roleta',
        example: 'Dobra de Saldo',
    })
    @IsNotEmpty({ message: 'O nome da opção é obrigatórrio'})
    @MaxLength(50, {message: 'O nome não pode ter mais de 50 caracteres'})
    @IsString({message: 'O nome deve ser um texto'})
    nome:string;

    @ApiProperty({
        type: String,
        maxLength: 20,
        description: 'Tipo da recompensa concedida',
        example: 'MOEDAS'       
    })
    @IsNotEmpty({message: 'O tipo da recompensa é obrigatório'})
    @MaxLength(20, {message: 'O tipo da recompensa não pode esceder 20 caracteres'})
    @IsString({ message: 'O tipo de recompensa deve ser um texto'})
    tipo_recompensa: string;

    @ApiProperty({
        type: Number,
        description: 'Quantidade de moedas ganhas',
        example: 40
    })
    @IsOptional()
    @IsInt({ message: 'O valor da recompensa deve ser um número inteiro'})
    @Min(0, { message: 'O valor da recompensa não pode ser negativo'})
    valor_recompensa?: number;

    @ApiProperty({
        type: Number,
        description: 'Porcentagem da chance desta opção na roleta',
        example: 15
    })
    @IsNotEmpty({ message: 'A chance da porcentagem é obrigatória'})
    @IsInt({ message: 'A chance da porcentagem deve ser um número inteiro'})
    @Min(1, {message: 'A chance mínima é de 1%'})
    @Max(100, {message: 'A chance máxima é de 100%'})
    chance_porcentagem: number;

    @ApiProperty({
        type: String,
        maxLength: 200,
        description: 'Descrição da opção sorteada',
        example: 'Dobra o valor apostado'
    })
    @IsOptional()
    @IsString({ message: 'A descrição deve ser um texo'})
    @MaxLength(200, {message: 'A descrição não pode ter mais de 200 caracteres'})
    descricao?: string
}
