import { PermissionLevel } from '@libs/common/entities';

export type PermissionAction = 'READ' | 'WRITE';

export const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export function getRequiredPermissionByMethod(method: string): PermissionAction {
  return WRITE_METHODS.has(method.toUpperCase()) ? 'WRITE' : 'READ';
}

export function canAccess(permission: PermissionLevel, required: PermissionAction): boolean {
  if (permission === PermissionLevel.ALL) {
    return true;
  }

  if (permission === PermissionLevel.NONE) {
    return false;
  }

  return permission === required;
}
