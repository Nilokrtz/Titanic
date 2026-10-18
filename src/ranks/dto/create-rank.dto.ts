import { IsString, IsNotEmpty, IsInt, Min, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRankDto {
    @ApiProperty({type: 'string', maxLength: 50, description: 'Nome do rank', example: 'Júnior'})
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    nome: string;

    @ApiProperty({ type: 'integer', minimum: 1, description: 'Nível numérico de acesso do rank', example: 2 })
    @IsInt()
    @Min(1)
    nivel_acesso: number;

    @ApiProperty({ type: 'integer', minimum: 0, description: 'XP mínimo necessário para alcançar este rank', example: 100 })
    @IsInt()
    @Min(0)
    xp_minimo: number;
}
