import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Min } from "class-validator";

export class CreateConquistaDto {
    @ApiProperty({ type: 'string', maxLength: 50, description: 'Nome da conquista', example: 'Conquista MegaBrain' })
    @IsNotEmpty()
    @IsString()
    nome : String;

    @ApiProperty({ type: 'string', maxLength: 200, description: 'Descricao da conquista', example: 'Conquista obtida ao derrotar o Boss sem erros' })
    descricao : String;


    @ApiProperty({ type: 'number', description: 'Recompensa da conquista/insignia/broche sendo o premio em xp ou moedas ou o broche em si', example: 999 })
    @Min(0, {message: 'A recompensa não pode ser negativa'})
    recompensa : number;

   
}
