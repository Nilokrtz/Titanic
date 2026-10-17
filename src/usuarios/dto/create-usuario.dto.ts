import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'aluno@exemplo.com', maxLength: 150 })
  @IsEmail()
  @MaxLength(150)
  email: string;

  @ApiProperty({ format: 'password', writeOnly: true })
  @IsString()
  @IsNotEmpty()
  senha: string;

  @ApiProperty({ example: 3, description: 'ID de um perfil existente' })
  @IsInt()
  @Min(1)
  perfil_id: number;
}
