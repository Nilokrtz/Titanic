import { PartialType } from '@nestjs/swagger';
import { CreatePermissoeDto } from './create-permissoe.dto.js';

export class UpdatePermissoeDto extends PartialType(CreatePermissoeDto) {}
