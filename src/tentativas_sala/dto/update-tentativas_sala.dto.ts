import { PartialType } from '@nestjs/mapped-types';
import { CreateTentativasDto } from './create-tentativas_sala.dto.js';

export class UpdateTentativasDto extends PartialType(CreateTentativasDto) {}
