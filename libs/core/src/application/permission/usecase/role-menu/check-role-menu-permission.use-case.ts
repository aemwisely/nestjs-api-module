import { canAccess, getRequiredPermissionByMethod, PermissionAction } from '@libs/core/domain';
import { Injectable } from '@nestjs/common';
import { RoleMenuFunctionalRepository } from '../../ports';

export type CheckRoleMenuPermissionInput = {
  role_id: string;
  method: string;
  module_code: string;
};

export type CheckRoleMenuPermissionResult = {
  allowed: boolean;
  required_permission: PermissionAction;
  matched_menu_code?: string;
};

@Injectable()
export class CheckRoleMenuPermissionUseCase {
  constructor(private roleMenuRepository: RoleMenuFunctionalRepository) {}

  async execute(input: CheckRoleMenuPermissionInput): Promise<CheckRoleMenuPermissionResult> {
    const requiredPermission = getRequiredPermissionByMethod(input.method);
    const decision = await this.roleMenuRepository.findPermissionDecision({
      role_id: input.role_id,
      module_code: input.module_code,
      required_permission: requiredPermission,
    });

    return {
      allowed: decision ? canAccess(decision.permission, requiredPermission) : false,
      required_permission: requiredPermission,
      matched_menu_code: decision?.menu_code,
    };
  }
}
