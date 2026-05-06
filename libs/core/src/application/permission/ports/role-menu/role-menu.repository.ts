import { PermissionLevel, RoleMenuEntity } from '@libs/common/entities';
import { PermissionAction } from '@libs/core/domain';
import { FindOneOptions } from 'typeorm';

export type PermissionDecision = {
  permission: PermissionLevel;
  menu_id: number;
  menu_code: string;
};

export abstract class RoleMenuFunctionalRepository {
  abstract create(dto: Partial<RoleMenuEntity>): RoleMenuEntity;
  abstract save(roleMenuEntity: RoleMenuEntity): Promise<RoleMenuEntity>;
  abstract findOne(opt: FindOneOptions<RoleMenuEntity>): Promise<RoleMenuEntity | null>;
  abstract findAllByRole(roleId: string): Promise<RoleMenuEntity[]>;
  abstract upsertPermission(dto: {
    role_id: string;
    menu_id: number;
    permission: PermissionLevel;
    updated_by_id: string;
  }): Promise<RoleMenuEntity>;
  abstract findPermissionDecision(params: {
    role_id: string;
    menu_codes: string[];
    required_permission: PermissionAction;
  }): Promise<PermissionDecision | null>;
}
