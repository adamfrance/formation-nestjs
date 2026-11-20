import { SetMetadata } from '@nestjs/common';
import { Role } from '../users/role.enum.js';

export const ROLES_KEY = 'roles';

// @Roles(Role.Teacher, Role.Admin) : la liste des rôles autorisés, lue par RolesGuard
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
