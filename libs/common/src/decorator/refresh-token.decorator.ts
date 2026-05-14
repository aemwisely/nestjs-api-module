import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * RefreshToken Decorator
 * Extracts the refresh token from the Authorization header.
 */
export const RefreshToken = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.substring(7);
});
