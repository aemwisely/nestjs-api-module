import { RoleMenuEntity } from '@libs/common/entities';
import { Injectable } from '@nestjs/common';
import { RoleMenuFunctionalRepository } from '../../ports';

@Injectable()
export class GetRoleMenuUseCase {
  constructor(private roleMenuRepository: RoleMenuFunctionalRepository) {}

  async findAllByRole(roleId: string): Promise<RoleMenuEntity[]> {
    return await this.roleMenuRepository.findAllByRole(roleId);
  }
}
