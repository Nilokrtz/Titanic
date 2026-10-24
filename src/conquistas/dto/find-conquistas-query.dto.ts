import { IsOptional, IsString, IsInt, Min, MaxLength } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class FindConquistasQueryDto {
    @ApiPropertyOptional({type: Number, 
         description: 'Número da página', 
         default: 1,
          example: 1})
    @IsOptional()
    @Type(() => Number)
    @IsInt({message: 'A página deve ser um número inteiro'})
    @Min(1, {message: 'A página mínima é 1'})
    page?: number = 1;

    @ApiPropertyOptional({type: Number, 
        description: 'Número de itens por página',
         default: 10, 
         example: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsInt({message: 'O número de itens por página deve ser um número inteiro'})
    @Min(1, {message: 'O número de itens por página mínima é 1'})
    limit?: number = 10;

    @ApiPropertyOptional({ type: String, 
        description: 'filtrar por nome da conquista',
         example: 'Conquista MegaBrain' })
    @IsOptional()
    @IsString({message: 'O nome da conquista deve ser um texto'})
    @MaxLength(50, {message: 'O nome da conquista não pode ter mais de 50 caracteres'})
    nome?: string;

    @ApiPropertyOptional({ type: String, 
        description: 'filtrar por descrição da conquista',
         example: 'Parabens voce zerou o jogo sem errar nenhuma questao, voce tem um verdadeiro Big Brain' })
    @IsOptional()
    @IsString({message: 'A descrição da conquista deve ser um texto'})
    @MaxLength(200, {message: 'A descrição da conquista não pode ter mais de 200 caracteres'})
    descricao?: string;
}