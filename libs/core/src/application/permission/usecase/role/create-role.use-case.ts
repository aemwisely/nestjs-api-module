import { Injectable } from '@nestjs/common';
import { RoleFunctionalRepository } from '../../ports';

export type CreateRoleInput = {
  title: string;
  isActive?: boolean;
  createdById: string;
  updatedById: string;
};

@Injectable()
export class CreateRoleUseCase {
  constructor(private roleRepository: RoleFunctionalRepository) {}

  async execute(input: CreateRoleInput) {
    const entity = this.roleRepository.create({
      title: input.title,
      is_active: input.isActive ?? true,
      created_by_id: input.createdById,
      updated_by_id: input.updatedById,
    });

    return await this.roleRepository.save(entity);
  }
}
