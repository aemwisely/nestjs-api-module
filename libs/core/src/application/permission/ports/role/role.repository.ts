import { RoleEntity } from '@libs/common/entities';
import { FindOneOptions } from 'typeorm';

export abstract class RoleFunctionalRepository {
  abstract create(dto: Partial<RoleEntity>): RoleEntity;
  abstract save(roleEntity: RoleEntity): Promise<RoleEntity>;
  abstract findOne(opt: FindOneOptions<RoleEntity>): Promise<RoleEntity | null>;
}
