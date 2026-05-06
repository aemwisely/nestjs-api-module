import {
  buildMenuCode,
  canAccess,
  getRequiredPermissionByMethod,
  PermissionAction,
} from '@libs/core/domain';
import { Injectable } from '@nestjs/common';
import { RoleMenuFunctionalRepository } from '../../ports';

export type CheckRoleMenuPermissionInput = {
  role_id: string;
  method: string;
  route_path: string;
  request_path: string;
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
    const menuCodes = [
      buildMenuCode(input.method, input.route_path),
      buildMenuCode(input.method, input.request_path),
      input.route_path,
      input.request_path,
    ];

    const decision = await this.roleMenuRepository.findPermissionDecision({
      role_id: input.role_id,
      menu_codes: [...new Set(menuCodes)],
      required_permission: requiredPermission,
    });

    return {
      allowed: decision ? canAccess(decision.permission, requiredPermission) : false,
      required_permission: requiredPermission,
      matched_menu_code: decision?.menu_code,
    };
  }
}
