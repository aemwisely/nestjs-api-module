import { PermissionLevel, RoleMenuEntity } from '@libs/common/entities';
import {
  PermissionDecision,
  RoleMenuFunctionalRepository,
} from '@libs/core/application/permission';
import { PermissionAction } from '@libs/core/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class RoleMenuRepository implements RoleMenuFunctionalRepository {
  constructor(
    @InjectRepository(RoleMenuEntity)
    private roleMenuRepository: Repository<RoleMenuEntity>,
  ) {}

  create(dto: Partial<RoleMenuEntity>): RoleMenuEntity {
    return this.roleMenuRepository.create(dto);
  }

  async save(roleMenuEntity: RoleMenuEntity): Promise<RoleMenuEntity> {
    return await this.roleMenuRepository.save(roleMenuEntity);
  }

  async findOne(opt: FindOneOptions<RoleMenuEntity>): Promise<RoleMenuEntity | null> {
    return await this.roleMenuRepository.findOne(opt);
  }

  async findAllByRole(roleId: string): Promise<RoleMenuEntity[]> {
    return await this.roleMenuRepository.find({
      where: { role_id: roleId },
      relations: { menu: true },
      order: { menu_id: 'ASC' },
    });
  }

  async upsertPermission(dto: {
    role_id: string;
    menu_id: number;
    permission: PermissionLevel;
    updated_by_id: string;
  }): Promise<RoleMenuEntity> {
    const existing = await this.roleMenuRepository.findOne({
      where: {
        role_id: dto.role_id,
        menu_id: dto.menu_id,
      },
    });

    const entity = existing
      ? this.roleMenuRepository.merge(existing, dto)
      : this.roleMenuRepository.create(dto);

    return await this.roleMenuRepository.save(entity);
  }

  async findPermissionDecision(params: {
    role_id: string;
    menu_codes: string[];
    required_permission: PermissionAction;
  }): Promise<PermissionDecision | null> {
    const permissionRank = `CASE roleMenu.permission
      WHEN 'ALL' THEN 3
      WHEN :requiredPermission THEN 2
      WHEN 'NONE' THEN 0
      ELSE 1
    END`;

    const row = await this.roleMenuRepository
      .createQueryBuilder('roleMenu')
      .innerJoin('roleMenu.menu', 'menu')
      .innerJoin('roleMenu.role', 'role')
      .select('roleMenu.permission', 'permission')
      .addSelect('menu.id', 'menu_id')
      .addSelect('menu.code', 'menu_code')
      .where('roleMenu.role_id = :roleId', { roleId: params.role_id })
      .andWhere('menu.is_active = true')
      .andWhere('role.is_active = true')
      .andWhere('(menu.code IN (:...menuCodes) OR menu.key IN (:...menuCodes))', {
        menuCodes: params.menu_codes,
      })
      .orderBy(permissionRank, 'DESC')
      .setParameter('requiredPermission', params.required_permission)
      .limit(1)
      .getRawOne<{
        permission: PermissionLevel;
        menu_id: number;
        menu_code: string;
      }>();

    return row ?? null;
  }
}
