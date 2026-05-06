import { PermissionLevel, RoleMenuEntity } from '@libs/common/entities';
import { Injectable } from '@nestjs/common';
import { RoleMenuFunctionalRepository } from '../../ports';

export type UpsertRoleMenuPermissionInput = {
  role_id: string;
  menu_id: number;
  permission: PermissionLevel;
  updated_by_id: string;
};

@Injectable()
export class UpsertRoleMenuPermissionUseCase {
  constructor(private roleMenuRepository: RoleMenuFunctionalRepository) {}

  async execute(input: UpsertRoleMenuPermissionInput): Promise<RoleMenuEntity> {
    return await this.roleMenuRepository.upsertPermission(input);
  }
}
