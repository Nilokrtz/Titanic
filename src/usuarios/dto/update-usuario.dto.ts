import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateUsuarioDto {
  @ApiProperty({ example: 'aluno@exemplo.com', maxLength: 150 })
  @IsEmail()
  @MaxLength(150)
  email: string;

  @ApiProperty({ example: 3, description: 'ID de um perfil existente' })
  @IsInt()
  @Min(1)
  perfil_id: number;

  @ApiPropertyOptional({ format: 'password', writeOnly: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  senha?: string;
}
