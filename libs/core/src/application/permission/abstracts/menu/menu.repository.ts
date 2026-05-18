import { MenuEntity } from '@libs/common/entities';
import { FindOneOptions } from 'typeorm';

export abstract class MenuFunctionalRepository {
  abstract create(dto: Partial<MenuEntity>): MenuEntity;
  abstract save(menuEntity: MenuEntity): Promise<MenuEntity>;
  abstract findOne(opt: FindOneOptions<MenuEntity>): Promise<MenuEntity | null>;
  abstract findAll(): Promise<MenuEntity[]>;
}
