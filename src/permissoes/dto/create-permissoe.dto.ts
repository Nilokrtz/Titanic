import { IsString, IsNotEmpty, IsInt, Min, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePermissoeDto {
    @ApiProperty({ 
        maxLength: 100, 
        description: 'Identificador único da permissão (slug)', 
        example: 'ACESSO_GERAL' 
    })
    @IsString({message: 'O identificador da permissão deve ser uma string.'})
    @IsNotEmpty({message: 'O identificador da permissão não pode estar vazio.'})
    @MaxLength(100, {message: 'O identificador da permissão não pode exceder 100 caracteres.'})
    slug: string;

    @ApiPropertyOptional({
        description: 'Descrição detalhada da permissão',
        example: 'Permissão que concede acesso geral ao sistema.',
        maxLength: 255,
    })
    @IsOptional()
    @IsString({message: 'A descrição da permissão deve ser uma string.'})
    @MaxLength(255, {message: 'A descrição da permissão não pode exceder 255 caracteres.'})
    descricao?: string;
}
