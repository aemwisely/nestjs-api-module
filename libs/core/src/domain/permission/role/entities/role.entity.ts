import { RoleEntity } from '@libs/common/entities';
import { uuidv7 } from 'uuidv7';

export type RoleProps = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  is_active: boolean;
  created_by_id: string;
  updated_by_id: string;
};

export class RoleModel {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public is_active: boolean,
    public readonly created_by_id: string,
    public readonly updated_by_id: string,
  ) {}

  deactivate(): void {
    this.is_active = false;
  }

  static create(props: {
    title: string;
    is_active: boolean;
    created_by_id: string;
    updated_by_id: string;
  }) {
    return new RoleModel(
      uuidv7(),
      props.title,
      props.is_active,
      props.created_by_id,
      props.updated_by_id,
    );
  }

  static toDomain(entity: RoleProps): RoleModel {
    return new RoleModel(
      entity.id,
      entity.title,
      entity.is_active,
      entity.created_by_id,
      entity.updated_by_id,
    );
  }

  static toEntity(domain: Partial<RoleModel>) {
    return new RoleEntity({
      id: domain.id,
      title: domain.title,
      is_active: domain.is_active,
      created_by_id: domain.created_by_id,
      updated_by_id: domain.updated_by_id,
    });
  }
}
