import type { Role } from '../users/role.enum.js';

// Ce que contient le jeton : de quoi reconnaître le compte et ses droits, rien de secret
export interface AuthUser {
  sub: string; // l'identifiant du compte (« subject », le nom standard dans un JWT)
  email: string;
  role: Role;
}
