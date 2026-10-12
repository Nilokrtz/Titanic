import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RegistrarDto {
  @IsEmail()
  @MaxLength(150)
  email: string;

  @IsString()
  @IsNotEmpty()
  senha: string;
}
