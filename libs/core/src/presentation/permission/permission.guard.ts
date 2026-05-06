import { IContext, PERMISSION_MODULE_CODE } from '@libs/common/decorator';
import { PermissionForbiddenException } from '@libs/common/exception';
import { CheckRoleMenuPermissionUseCase } from '@libs/core/application/permission';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly checkPermissionUseCase: CheckRoleMenuPermissionUseCase,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user?: IContext }>();
    const user = request.user;

    if (!user?.role_id) {
      throw new PermissionForbiddenException({
        path: request.path,
        method: request.method,
        reason: 'ROLE_REQUIRED',
      });
    }

    const moduleCode = this.reflector.getAllAndOverride<string>(PERMISSION_MODULE_CODE, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!moduleCode) {
      throw new PermissionForbiddenException({
        path: request.path,
        method: request.method,
        reason: 'PERMISSION_MODULE_CODE_REQUIRED',
      });
    }

    const decision = await this.checkPermissionUseCase.execute({
      roleId: user.role_id,
      method: request.method,
      moduleCode: moduleCode,
    });

    if (!decision.allowed) {
      throw new PermissionForbiddenException({
        moduleCode: moduleCode,
        path: request.path,
        method: request.method,
        requiredPermission: decision.required_permission,
      });
    }

    return true;
  }
}
