import { PartialType } from '@nestjs/mapped-types';
import { CreateRankDto } from './create-rank.dto.js';

export class UpdateRankDto extends PartialType(CreateRankDto) {}
