import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindPermissoesQueryDto {
    @ApiPropertyOptional({ 
        type: 'integer', 
        description: 'Número da página', 
        default: 1, 
        example: 1 
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'O número da página deve ser um inteiro.' })
    @Min(1, { message: 'O número da página deve ser no mínimo 1.' })
    page?: number = 1;

    @ApiPropertyOptional({ 
        type: 'integer', 
        description: 'Número de itens por página',
        default: 10,
        example: 10 
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'O número de itens por página deve ser um inteiro.' })
    @Min(1, { message: 'O número de itens por página deve ser no mínimo 1.' })
    limit?: number = 10;

    @ApiPropertyOptional({ 
        type: 'string', 
        description: 'Filtrar por identificador da permissão (slug)',
        example: 'ACESSO_GERAL'
    })
    @IsOptional()
    @IsString({ message: 'O identificador da permissão (slug) deve ser um texto.' })
    slug?: string;

    @ApiPropertyOptional({ 
        type: 'string', 
        description: 'Filtrar por descrição da permissão',
        example: 'Permissão que concede acesso geral ao sistema.'
    })
    @IsOptional()
    @IsString({ message: 'A descrição da permissão deve ser um texto.' })
    descricao?: string;

}