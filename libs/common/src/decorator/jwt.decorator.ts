import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface IContext {
  sub: string;
  email: string;
}

export const Context = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user as IContext;
});
