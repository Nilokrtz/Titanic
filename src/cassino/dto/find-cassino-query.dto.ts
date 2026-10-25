import { IsOptional, isString, IsInt, Min, MaxLength, IsString } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class FindCassinoQueryDto{
    @ApiPropertyOptional({
        type: Number,
        description: 'Número da página desejada',
        default: 1,
        example: 1
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'O número de páginas deve ser um número inteiro'})
    @Min(1, {message: 'A quantidade de página mínima é 1'})
    page?: number = 1;

    @ApiPropertyOptional({
        type: Number,
        description: 'Quantidade de registros por página',
        default: 10,
        example: 10
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'A quantidade de registros deve ser um número inteiro'})
    @Min(1, {message: 'O limite mínimo por páginas é 1'})
    limit?: number = 10;

    @ApiPropertyOptional({
        type: String,
        description: 'Filtrar pelo nome das opções do cassino',
        example: 'Dobra de Saldo'
    })
    @IsOptional()
    @IsString({ message: 'O nome do filtro deve ser um texto'})
    @MaxLength(50, {message: 'O filtro de nome não pode exceder 50 caracteres'})
    nome?: string;

    @ApiPropertyOptional({
        type: String,
        description: 'Filtrar pelo tipo de recompensa',
        example: 'MOEDAS'
    })
    @IsOptional()
    @IsString({ message: 'O tipo de recompensa deve ser um texto'})
    @MaxLength(20, {message: 'O tipo de recompensa não pode exceder 20 caracteres'})
    tipo_recompensa?: string;
}