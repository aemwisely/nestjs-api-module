import { UserEntity } from '@libs/common/entities';
import { UserModel } from '@libs/core/domain';
import { SelectQueryBuilder } from 'typeorm';

export abstract class UserFunctionalRepository {
  abstract findById(id: string): Promise<UserModel | null>;
  abstract create(body: Partial<UserModel>): UserModel;
  abstract save(user: UserModel): Promise<UserEntity>;
  abstract findAll(): Promise<UserModel[]>;
  abstract useQueryBuilder(): SelectQueryBuilder<UserEntity>;
}
