import { PartialType } from '@nestjs/mapped-types';
import { CreateInventarioItenDto } from './create-inventario_iten.dto.js';

export class UpdateInventarioItenDto extends PartialType(CreateInventarioItenDto) {}
