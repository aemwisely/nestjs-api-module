import { RoleEntity } from '@libs/common/entities';
import { Injectable } from '@nestjs/common';
import { RoleFunctionalRepository } from '../../ports';

@Injectable()
export class GetRoleUseCase {
  constructor(private roleRepository: RoleFunctionalRepository) {}

  async findAll(): Promise<RoleEntity[]> {
    return await this.roleRepository.findAll();
  }
}
