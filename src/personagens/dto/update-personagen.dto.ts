import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonagenDto } from './create-personagen.dto.js';

export class UpdatePersonagenDto extends PartialType(CreatePersonagenDto) {}
