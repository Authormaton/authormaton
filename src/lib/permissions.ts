import { UserRole } from "@prisma/client";

export function hasProjectPermission(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole);
}

export function isProjectAdmin(userRole: UserRole): boolean {
  return userRole === UserRole.ADMIN;
}

export function isProjectMember(userRole: UserRole): boolean {
  return userRole === UserRole.MEMBER || userRole === UserRole.ADMIN;
}
