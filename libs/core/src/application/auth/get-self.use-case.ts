import { Injectable } from '@nestjs/common';
import { GetUserUseCase } from '../user';
import { IContext } from '@libs/common/decorator';
import { UserUnauthorizedException } from '@libs/common';

@Injectable()
export class GetSelfUseCase {
  constructor(private getUserUseCase: GetUserUseCase) {}

  async execute(context: IContext) {
    const { sub } = context;

    const entity = await this.getUserUseCase.getOneEntity(sub);

    if (!entity) {
      throw new UserUnauthorizedException(context);
    }

    return entity;
  }
}
