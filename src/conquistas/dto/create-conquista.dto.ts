import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsObject, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class CreateConquistaDto {
    @ApiProperty({ 
        type: String,
        maxLength: 50,
        description: 'Nome da conquista', 
        example: 'Conquista MegaBrain' })
    @IsNotEmpty({ message: 'O nome da conquista é obrigatório' })
    @MaxLength(50, {message: 'O nome da conquista não pode ter mais de 50 caracteres'})
    @IsString({ message: 'O nome deve ser um texto' })
    nome : string;

    @ApiProperty({ type: String,
         maxLength: 200,
          description: 'Descricao da conquista',
           example: 'Conquista obtida ao derrotar o Boss sem erros' })
    @IsOptional()
    @IsString({ message: 'A descrição deve ser um texto' })
    @MaxLength(200, {message: 'A descrição da conquista não pode ter mais de 200 caracteres'})
    descricao : string;


    @ApiProperty({ type: Number,
         description: 'Recompensa da conquista/insignia/broche sendo o premio em xp ou moedas ou o broche em si',
          example: 999 })
    @IsInt({ message: 'A recompensa deve ser um número inteiro' })
    @Min(0, {message: 'A recompensa não pode ser negativa'})
    recompensa : number;

   
}
