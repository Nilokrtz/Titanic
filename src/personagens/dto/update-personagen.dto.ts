import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdatePersonagenDto {
  @ApiProperty({ example: 'DevMaster', maxLength: 80 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  nome: string;
}
