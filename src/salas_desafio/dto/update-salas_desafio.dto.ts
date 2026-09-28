import { PartialType } from '@nestjs/mapped-types';
import { CreateSalasDesafioDto } from './create-salas_desafio.dto.js';

export class UpdateSalasDesafioDto extends PartialType(CreateSalasDesafioDto) {}
