import { PermissionLevel, RoleMenuEntity } from '@libs/common/entities';
import { Injectable } from '@nestjs/common';
import { RoleMenuFunctionalRepository } from '../../ports';

export type UpsertRoleMenuPermissionInput = {
  roleId: string;
  menuId: number;
  permission: PermissionLevel;
  updatedById: string;
};

@Injectable()
export class UpsertRoleMenuPermissionUseCase {
  constructor(private roleMenuRepository: RoleMenuFunctionalRepository) {}

  async execute(input: UpsertRoleMenuPermissionInput): Promise<RoleMenuEntity> {
    return await this.roleMenuRepository.upsertPermission({
      role_id: input.roleId,
      menu_id: input.menuId,
      permission: input.permission,
      updated_by_id: input.updatedById,
    });
  }
}
