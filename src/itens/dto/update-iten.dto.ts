import { PartialType } from '@nestjs/mapped-types';
import { CreateItenDto } from './create-iten.dto.js';

export class UpdateItenDto extends PartialType(CreateItenDto) {}
