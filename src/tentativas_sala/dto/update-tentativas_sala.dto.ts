import { PartialType } from '@nestjs/mapped-types';
import { CreateTentativasSalaDto } from './create-tentativas_sala.dto.js';

export class UpdateTentativasSalaDto extends PartialType(CreateTentativasSalaDto) {}
