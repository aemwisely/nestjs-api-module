import { UserEntity } from '@libs/common/entities';
import { UserModel } from '@libs/core/domain';
import { SelectQueryBuilder } from 'typeorm';

export interface UserFunctionalRepository {
  findById(id: string): Promise<UserModel | null>;
  create(body: Partial<UserModel>): UserModel;
  save(user: UserModel): Promise<void>;
  findAll(): Promise<UserModel[]>;
  useQueryBuilder(): SelectQueryBuilder<UserEntity>;
}
