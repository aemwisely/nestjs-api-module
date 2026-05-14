import { Injectable } from '@nestjs/common';
import { GetUserUseCase } from '../user';
import { IContext } from '@libs/common/decorator';
import { UserUnauthorizedException } from '@libs/common';
import { RoleEntity } from '@libs/common/entities';

export type SelfResponse = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  role_id: string;
  role?: RoleEntity;
};

@Injectable()
export class GetSelfUseCase {
  constructor(private getUserUseCase: GetUserUseCase) {}

  async execute(context: IContext): Promise<SelfResponse> {
    const { sub } = context;

    const entity = await this.getUserUseCase.getOneEntity(sub);

    if (!entity) {
      throw new UserUnauthorizedException(context);
    }

    return {
      id: entity.id,
      first_name: entity.first_name,
      last_name: entity.last_name,
      email: entity.email,
      is_active: entity.is_active,
      role_id: entity.role_id,
      role: entity.role,
    };
  }
}
