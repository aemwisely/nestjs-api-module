import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccessTokenInvalidException, UserUnauthorizedException } from '../exception';

export class JwtGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (err || !user) {
      if (info?.name === 'TokenExpiredError' || info?.message === 'jwt expired') {
        throw new AccessTokenInvalidException({
          path: request.url,
          method: request.method,
        });
      }

      throw new UserUnauthorizedException({
        path: request.url,
        method: request.method,
      });
    }

    return user;
  }
}
