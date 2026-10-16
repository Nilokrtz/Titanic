import { IsOptional, IsString, IsInt, Min } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class FindRanksQueryDto {
    @ApiPropertyOptional({ description: 'Número da página', default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt({message: 'A página deve ser um número inteiro'})
    @Min(1, {message: 'A página mínima é 1'})
    page?: number = 1;

    @ApiPropertyOptional({ description: 'Número de itens por página', default: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsInt({message: 'O número de itens por página deve ser um número inteiro'})
    @Min(1, {message: 'O número de itens por página mínima é 1'})
    limit?: number = 10;

    @ApiPropertyOptional({ description: 'filtrar por nome do rank' })
    @IsOptional()
    @IsString({message: 'O nome do rank deve ser um texto'})
    nome?: string;

    @ApiPropertyOptional({ description: 'filtrar por nível do rank' })
    @IsOptional()
    @Type(() => Number)
    @IsInt({message: 'O nível do rank deve ser um número inteiro'})
    nivel_acesso?: number;
}