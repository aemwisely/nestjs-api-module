import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * AccessToken Decorator
 * Extracts the access token from the Authorization header
 */
export const AccessToken = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.substring(7); // Remove 'Bearer ' prefix
});
