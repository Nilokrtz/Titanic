import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class CreatePersonagenDto {
@ApiProperty({
    type: 'string',
    maxLength: 80,
    description: 'Nome único do personagem',
    example: 'DevMaster',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  nome: string;

  @ApiProperty({
    type: 'integer',
    minimum: 1,
    description: 'ID da especialização do personagem',
    example: 1,
  })
  @IsInt()
  @Min(1)
  especializacao_id: number;
}
