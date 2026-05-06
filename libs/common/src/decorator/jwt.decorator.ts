import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface IContext {
  sub: string;
  email: string;
  role_id?: string;
  session_id?: string;
  iat?: number;
  exp?: number;
}

export const Context = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user as IContext;
});
