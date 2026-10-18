import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdicionarPermissaoPerfilDto {
  @ApiProperty({
    description: 'ID da permissão a ser associada ao perfil',
    example: 1,
  })
  @IsInt({ message: 'O ID da permissão deve ser um número inteiro.' })
  @IsNotEmpty({ message: 'O ID da permissão é obrigatório.' })
  permissaoId: number;
} 