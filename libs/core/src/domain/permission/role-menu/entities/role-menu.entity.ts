import { PermissionLevel, RoleMenuEntity } from '@libs/common/entities';

export type RoleMenuProps = {
  id: number;
  role_id: string;
  menu_id: number;
  permission: PermissionLevel;
  updated_by_id: string;
};

export class RoleMenuModel {
  constructor(
    public readonly id: number | undefined,
    public readonly role_id: string,
    public readonly menu_id: number,
    public permission: PermissionLevel,
    public readonly updated_by_id: string,
  ) {}

  updatePermission(permission: PermissionLevel): void {
    this.permission = permission;
  }

  static create(props: Omit<RoleMenuProps, 'id'>): RoleMenuModel {
    return new RoleMenuModel(
      undefined,
      props.role_id,
      props.menu_id,
      props.permission,
      props.updated_by_id,
    );
  }

  static toDomain(entity: RoleMenuProps): RoleMenuModel {
    return new RoleMenuModel(
      entity.id,
      entity.role_id,
      entity.menu_id,
      entity.permission,
      entity.updated_by_id,
    );
  }

  static toEntity(domain: Partial<RoleMenuModel>): RoleMenuEntity {
    return new RoleMenuEntity({
      id: domain.id,
      role_id: domain.role_id,
      menu_id: domain.menu_id,
      permission: domain.permission,
      updated_by_id: domain.updated_by_id,
    });
  }
}
