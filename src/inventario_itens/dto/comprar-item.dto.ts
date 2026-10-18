import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class ComprarItemDto {
  @ApiProperty({
    description: 'ID do item a ser comprado',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  item_id?: number;

  @ApiPropertyOptional({
    description: 'ID do item a ser comprado (formato alternativo em camelCase)',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  itemId?: number;

  @ApiPropertyOptional({
    description: 'Quantidade de itens a serem comprados (padrão: 1, máximo: 2)',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(2)
  quantidade?: number = 1;
}

