import { Role } from "@/generated/prisma/client";

export function hasProjectPermission(userRole: Role, requiredRoles: Role[]): boolean {
  return requiredRoles.includes(userRole);
}

export function isProjectAdmin(userRole: Role): boolean {
  return userRole === Role.ADMIN;
}

export function isProjectMember(userRole: Role): boolean {
  return userRole === Role.USER || userRole === Role.ADMIN;
}
