import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserUnauthorizedException } from '../exception';

export class JwtGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (err || !user) {
      throw new UserUnauthorizedException({
        path: request.url,
        method: request.method,
        info: info?.message,
      });
    }

    return user;
  }
}
