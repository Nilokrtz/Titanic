import { ApiProperty } from '@nestjs/swagger';
import { ItemRespostaDto } from './item-resposta.dto.js';

export class ListarItensRespostaDto { 
    @ApiProperty({ type: [ItemRespostaDto] })
    items: ItemRespostaDto[];

    @ApiProperty({ example: 1 })
    page: number;

    @ApiProperty({ example: 10 })
    limit: number;

    @ApiProperty({ example: 20 })
    total: number;
}