import { PartialType } from '@nestjs/swagger';
import { CreateEspecializacoeDto } from './create-especializacoe.dto.js';

export class UpdateEspecializacoeDto extends PartialType(CreateEspecializacoeDto) {}
