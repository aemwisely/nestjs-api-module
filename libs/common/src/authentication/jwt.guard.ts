import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserUnauthorizedException } from '../exception';
import { IContext } from '../decorator';

export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;

    if (!result) {
      throw new UserUnauthorizedException({ context: context.switchToHttp().getRequest() });
    }

    const request = context.switchToHttp().getRequest();
    const userAction = request?.user as IContext;
    console.log('🚀 - userAction:', userAction);

    return !!userAction;
  }
}
