import { MenuEntity } from '@libs/common/entities';

export type MenuProps = {
  id: number;
  title: string;
  key: string;
  code: string;
  is_active: boolean;
};

export class MenuModel {
  constructor(
    public readonly id: number | undefined,
    public readonly title: string,
    public readonly key: string,
    public readonly code: string,
    public is_active: boolean,
  ) {}

  deactivate(): void {
    this.is_active = false;
  }

  static create(props: Omit<MenuProps, 'id'>): MenuModel {
    return new MenuModel(undefined, props.title, props.key, props.code, props.is_active);
  }

  static toDomain(entity: MenuProps): MenuModel {
    return new MenuModel(entity.id, entity.title, entity.key, entity.code, entity.is_active);
  }

  static toEntity(domain: Partial<MenuModel>): MenuEntity {
    return new MenuEntity({
      id: domain.id,
      title: domain.title,
      key: domain.key,
      code: domain.code,
      is_active: domain.is_active,
    });
  }
}
