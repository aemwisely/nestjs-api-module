import { IUserQueryBuilder } from '@libs/common/base';
import { UserEntity } from '@libs/common/entities';
import { TUserEntity, UserModel } from '@libs/core/domain';

export abstract class UserFunctionalRepository {
  abstract findById(id: string): Promise<UserModel | null>;
  abstract create(body: Partial<TUserEntity>): UserModel;
  abstract save(user: TUserEntity): Promise<UserEntity>;
  abstract findAll(): Promise<TUserEntity[]>;
  abstract useQueryBuilder(): IUserQueryBuilder<TUserEntity>;
}
