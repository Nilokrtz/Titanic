import { PartialType } from '@nestjs/mapped-types';
import { CreateAtributoDto } from './create-atributo.dto.js';

export class UpdateAtributoDto extends PartialType(CreateAtributoDto) {}
