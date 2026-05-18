import { MenuEntity } from '@libs/common/entities';
import { MenuFunctionalRepository } from '@libs/core/application';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class MenuRepository implements MenuFunctionalRepository {
  constructor(
    @InjectRepository(MenuEntity)
    private menuRepository: Repository<MenuEntity>,
  ) {}

  create(dto: Partial<MenuEntity>): MenuEntity {
    return this.menuRepository.create(dto);
  }

  async save(menuEntity: MenuEntity): Promise<MenuEntity> {
    return await this.menuRepository.save(menuEntity);
  }

  async findOne(opt: FindOneOptions<MenuEntity>): Promise<MenuEntity | null> {
    return await this.menuRepository.findOne(opt);
  }

  async findAll(): Promise<MenuEntity[]> {
    return await this.menuRepository.find({
      order: { id: 'ASC' },
    });
  }
}
