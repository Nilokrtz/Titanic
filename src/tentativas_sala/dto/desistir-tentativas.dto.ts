import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class DesistirTentativaDto {
  @ApiProperty({ description: 'ID do personagem que desiste da tentativa', example: 1 })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  personagem_id: number;
}