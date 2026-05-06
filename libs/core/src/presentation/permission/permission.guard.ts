import { IContext } from '@libs/common/decorator';
import { PermissionForbiddenException } from '@libs/common/exception';
import { CheckRoleMenuPermissionUseCase } from '@libs/core/application/permission';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PATH_METADATA } from '@nestjs/common/constants';
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

    const routePath = this.getRoutePath(context);
    const decision = await this.checkPermissionUseCase.execute({
      role_id: user.role_id,
      method: request.method,
      route_path: routePath,
      request_path: request.path,
    });

    if (!decision.allowed) {
      throw new PermissionForbiddenException({
        path: routePath,
        method: request.method,
        required_permission: decision.required_permission,
      });
    }

    return true;
  }

  private getRoutePath(context: ExecutionContext): string {
    const controllerPath = this.reflector.get<string | string[]>(
      PATH_METADATA,
      context.getClass(),
    );
    const handlerPath = this.reflector.get<string | string[]>(PATH_METADATA, context.getHandler());
    return this.normalizePath(controllerPath, handlerPath);
  }

  private normalizePath(
    controllerPath: string | string[] | undefined,
    handlerPath: string | string[] | undefined,
  ): string {
    const controller = Array.isArray(controllerPath) ? controllerPath[0] : controllerPath;
    const handler = Array.isArray(handlerPath) ? handlerPath[0] : handlerPath;
    const parts = [controller, handler]
      .filter((part): part is string => Boolean(part))
      .map((part) => part.replace(/^\/+|\/+$/g, ''))
      .filter(Boolean);

    return `/${parts.join('/')}`.replace(/\/+/g, '/');
  }
}
