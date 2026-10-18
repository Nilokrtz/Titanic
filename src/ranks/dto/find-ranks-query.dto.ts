import { IsOptional, IsString, IsInt, Min } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class FindRanksQueryDto {
    @ApiPropertyOptional({type: 'integer',  description: 'Número da página', default: 1, example: 1})
    @IsOptional()
    @Type(() => Number)
    @IsInt({message: 'A página deve ser um número inteiro'})
    @Min(1, {message: 'A página mínima é 1'})
    page?: number = 1;

    @ApiPropertyOptional({type: 'integer', description: 'Número de itens por página', default: 10, example: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsInt({message: 'O número de itens por página deve ser um número inteiro'})
    @Min(1, {message: 'O número de itens por página mínima é 1'})
    limit?: number = 10;

    @ApiPropertyOptional({ type: 'string', description: 'filtrar por nome do rank', example: 'Júnior' })
    @IsOptional()
    @IsString({message: 'O nome do rank deve ser um texto'})
    nome?: string;

    @ApiPropertyOptional({type: 'integer', description: 'filtrar por nível de acesso do rank', example: 2 })
    @IsOptional()
    @Type(() => Number)
    @IsInt({message: 'O nível de acesso do rank deve ser um número inteiro'})
    nivel_acesso?: number;

    @ApiPropertyOptional({type: 'integer', description: 'filtrar por XP mínimo do rank', example: 100 })
    @IsOptional()
    @Type(() => Number)
    @IsInt({message: 'O XP mínimo do rank deve ser um número inteiro'})
    @Min(0, {message: 'O XP mínimo do rank não pode ser negativo'})
    xp_minimo?: number;
}