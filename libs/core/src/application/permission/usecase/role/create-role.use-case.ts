import { Injectable } from '@nestjs/common';
import { RoleFunctionalRepository } from '../../ports';

export type CreateRoleInput = {
  title: string;
  is_active?: boolean;
  created_by_id: string;
  updated_by_id: string;
};

@Injectable()
export class CreateRoleUseCase {
  constructor(private roleRepository: RoleFunctionalRepository) {}

  async execute(input: CreateRoleInput) {
    const entity = this.roleRepository.create({
      title: input.title,
      is_active: input.is_active ?? true,
      created_by_id: input.created_by_id,
      updated_by_id: input.updated_by_id,
    });

    return await this.roleRepository.save(entity);
  }
}
