import { JwtGuard } from '@libs/common/authentication';
import { PermissionGuard } from '@libs/core/presentation';
import { GUARDS_METADATA } from '@nestjs/common/constants';
import { AuthController } from './auth.controller';

describe('AuthController guards', () => {
  it.each(['revokeToken', 'renewToken', 'getSelf'] as const)(
    'requires jwt and permission guards for %s',
    (methodName) => {
      const guards = Reflect.getMetadata(GUARDS_METADATA, AuthController.prototype[methodName]);

      expect(guards).toEqual([JwtGuard, PermissionGuard]);
    },
  );
});
