import { PartialType } from '@nestjs/swagger';
import { CreateEspecializacoeDto } from './create-especializacoes.dto.js';

export class UpdateEspecializacoeDto extends PartialType(CreateEspecializacoeDto) {}
