import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class VenderItemDto {
  @ApiPropertyOptional({
    description: 'ID do item no catálogo a ser vendido do inventário',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  item_id?: number;

  @ApiPropertyOptional({
    description: 'ID do item no catálogo (formato alternativo camelCase)',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  itemId?: number;

  @ApiPropertyOptional({
    description: 'ID do registro no inventário do personagem',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  inventario_id?: number;

  @ApiPropertyOptional({
    description: 'ID do registro no inventário (formato alternativo camelCase)',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  inventarioId?: number;

  @ApiPropertyOptional({
    description: 'ID genérico (pode ser o ID do item ou do inventário)',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  id?: number;

  @ApiPropertyOptional({
    description: 'Quantidade de unidades a serem vendidas (padrão: 1)',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  quantidade?: number = 1;
}

