import { IsOptional, IsInt, Min, IsEnum, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { tipo_especializacao, tipo_topico_questao } from '../../generated/prisma/client.js';

export class FindEspecializacoesQueryDto {
    @ApiPropertyOptional({ type: 'integer', description: 'Número da página', default: 1, example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'A página deve ser um número inteiro' })
    @Min(1, { message: 'A página mínima é 1' })
    page?: number = 1;

    @ApiPropertyOptional({ type: 'integer', description: 'Número de itens por página', default: 10, example: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'O número de itens por página deve ser um número inteiro' })
    @Min(1, { message: 'O número de itens por página mínima é 1' })
    limit?: number = 10;

    @ApiPropertyOptional({ 
        enum: tipo_especializacao, 
        description: 'Filtrar por nome da especialização', 
        example: tipo_especializacao.back_end 
    })
    @IsOptional()
    @IsEnum(tipo_especializacao, {
        message: 'O nome deve ser uma especialização válida (ia, seguranca, dados, front_end, back_end).',
    })
    nome?: tipo_especializacao;

    @ApiPropertyOptional({ 
        enum: tipo_topico_questao, 
        description: 'Filtrar por atributo foco da especialização', 
        example: tipo_topico_questao.back_end 
    })
    @IsOptional()
    @IsEnum(tipo_topico_questao, {
        message: 'O atributo foco deve ser um tópico válido (ia, seguranca, dados, front_end, back_end).',
    })
    atributo_foco?: tipo_topico_questao;

    @ApiPropertyOptional({
        type: 'string',
        description: 'Filtrar por trecho da descrição da especialização',
        example: 'Especialização em desenvolvimento back-end',
    })
    @IsOptional()
    @IsString({ message: 'A descrição deve ser um texto' })
    descricao?: string;
}   