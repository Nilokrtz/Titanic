import { PartialType } from '@nestjs/mapped-types';
import { CreateQuizQuestoesDto } from './create-quiz_questoes.dto.js';

export class UpdateQuizQuestoesDto extends PartialType(CreateQuizQuestoesDto) {}
