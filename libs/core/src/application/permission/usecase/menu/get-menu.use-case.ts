import { MenuEntity } from '@libs/common/entities';
import { Injectable } from '@nestjs/common';
import { MenuFunctionalRepository } from '../../ports';

@Injectable()
export class GetMenuUseCase {
  constructor(private menuRepository: MenuFunctionalRepository) {}

  async findAll(): Promise<MenuEntity[]> {
    return await this.menuRepository.findAll();
  }
}
