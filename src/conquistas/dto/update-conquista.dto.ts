import { PartialType } from '@nestjs/swagger';
import { CreateConquistaDto } from './create-conquista.dto.js';

export class UpdateConquistaDto extends PartialType(CreateConquistaDto) {}
