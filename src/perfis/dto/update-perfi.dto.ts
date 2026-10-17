import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdatePerfiDto {
  @ApiProperty({ example: 'Perfil de aluno', maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  descricao: string;
}
