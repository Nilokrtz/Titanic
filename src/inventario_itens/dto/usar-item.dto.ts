import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class UsarItemDto {
  @ApiPropertyOptional({
    description: 'ID da sala de desafio (opcional)',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  sala_id?: number;

  @ApiPropertyOptional({
    description: 'ID da tentativa de sala (opcional)',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  tentativa_id?: number;
}
