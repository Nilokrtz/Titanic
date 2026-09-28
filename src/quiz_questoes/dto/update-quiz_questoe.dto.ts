import { PartialType } from '@nestjs/mapped-types';
import { CreateQuizQuestoeDto } from './create-quiz_questoe.dto.js';

export class UpdateQuizQuestoeDto extends PartialType(CreateQuizQuestoeDto) {}
