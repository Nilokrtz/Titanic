import { PartialType } from '@nestjs/swagger';
import { CreateCassinoDto } from './create-cassino.dto.js';

export class UpdateCassinoDto extends PartialType(CreateCassinoDto) {}
