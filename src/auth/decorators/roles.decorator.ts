import { SetMetadata } from '@nestjs/common';
import { tipo_perfil } from '../../generated/prisma/client.js';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: tipo_perfil[]) => SetMetadata(ROLES_KEY, roles);