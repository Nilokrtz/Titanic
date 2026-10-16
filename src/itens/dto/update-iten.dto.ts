import { PartialType } from '@nestjs/swagger';
import { CreateItenDto } from './create-iten.dto.js';

export class UpdateItenDto extends PartialType(CreateItenDto) {}
