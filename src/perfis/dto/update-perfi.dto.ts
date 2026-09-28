import { PartialType } from '@nestjs/mapped-types';
import { CreatePerfiDto } from './create-perfi.dto.js';

export class UpdatePerfiDto extends PartialType(CreatePerfiDto) {}
