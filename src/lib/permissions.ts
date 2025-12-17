import { Role } from '@/generated/prisma/client';
import { Result, success, error, ErrorCodes } from '@/lib/result';

export function hasProjectPermission(userRole: Role, requiredRoles: Role[]): Result<boolean> {
  if (requiredRoles.includes(userRole)) {
    return success(true);
  }
  return error<boolean>("Permission denied", ErrorCodes.FORBIDDEN);
}

export function isProjectAdmin(userRole: Role): Result<boolean> {
  if (userRole === Role.ADMIN) {
    return success(true);
  }
  return error<boolean>("Permission denied", ErrorCodes.FORBIDDEN);
}

export function isProjectMember(userRole: Role): Result<boolean> {
  if (userRole === Role.USER || userRole === Role.ADMIN) {
    return success(true);
  }
  return error<boolean>("Permission denied", ErrorCodes.FORBIDDEN);
}
