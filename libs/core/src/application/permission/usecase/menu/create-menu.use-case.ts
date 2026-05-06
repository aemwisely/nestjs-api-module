import { MenuEntity } from '@libs/common/entities';
import { Injectable } from '@nestjs/common';
import { MenuFunctionalRepository } from '../../ports';

export type CreateMenuInput = {
  title: string;
  key: string;
  code: string;
  isActive?: boolean;
};

@Injectable()
export class CreateMenuUseCase {
  constructor(private menuRepository: MenuFunctionalRepository) {}

  async execute(input: CreateMenuInput): Promise<MenuEntity> {
    const entity = this.menuRepository.create({
      title: input.title,
      key: input.key,
      code: input.code,
      is_active: input.isActive ?? true,
    });

    return await this.menuRepository.save(entity);
  }
}
