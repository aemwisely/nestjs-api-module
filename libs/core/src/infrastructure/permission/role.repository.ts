import { RoleEntity } from '@libs/common/entities';
import { RoleFunctionalRepository } from '@libs/core/application';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class RoleRepository implements RoleFunctionalRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  create(dto: Partial<RoleEntity>): RoleEntity {
    const createRole = this.roleRepository.create(dto);
    return createRole;
  }

  async save(roleEntity: RoleEntity): Promise<RoleEntity> {
    return await this.roleRepository.save(roleEntity);
  }

  async findOne(opt: FindOneOptions<RoleEntity>): Promise<RoleEntity | null> {
    return await this.roleRepository.findOne(opt);
  }

  async findAll(): Promise<RoleEntity[]> {
    return await this.roleRepository.find({
      order: { created_at: 'DESC' },
    });
  }
}
