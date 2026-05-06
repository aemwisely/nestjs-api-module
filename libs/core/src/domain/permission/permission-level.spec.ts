import { PermissionLevel } from '@libs/common/entities';
import {
  buildMenuCode,
  canAccess,
  getRequiredPermissionByMethod,
} from './permission-level';

describe('permission-level', () => {
  it('maps readonly http methods to READ and write methods to WRITE', () => {
    expect(getRequiredPermissionByMethod('GET')).toBe('READ');
    expect(getRequiredPermissionByMethod('post')).toBe('WRITE');
    expect(getRequiredPermissionByMethod('PATCH')).toBe('WRITE');
    expect(getRequiredPermissionByMethod('DELETE')).toBe('WRITE');
  });

  it('allows only matching permission levels except ALL', () => {
    expect(canAccess(PermissionLevel.ALL, 'READ')).toBe(true);
    expect(canAccess(PermissionLevel.ALL, 'WRITE')).toBe(true);
    expect(canAccess(PermissionLevel.READ, 'READ')).toBe(true);
    expect(canAccess(PermissionLevel.READ, 'WRITE')).toBe(false);
    expect(canAccess(PermissionLevel.WRITE, 'WRITE')).toBe(true);
    expect(canAccess(PermissionLevel.WRITE, 'READ')).toBe(false);
    expect(canAccess(PermissionLevel.NONE, 'READ')).toBe(false);
  });

  it('builds stable method path menu codes', () => {
    expect(buildMenuCode('get', '/user/:id')).toBe('GET:/user/:id');
  });
});
