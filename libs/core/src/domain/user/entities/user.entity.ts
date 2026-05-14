import { RoleEntity, UserEntity } from '@libs/common/entities';
import { uuidv7 } from 'uuidv7';

export type TUserEntity = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  is_active: boolean;
  session_id?: string;
  refresh_token?: string;
  role_id: string;
  role?: RoleEntity;
};

export class UserModel {
  constructor(
    public readonly id: string,
    public readonly first_name: string,
    public readonly last_name: string,
    public readonly email: string,
    public readonly password: string,
    public is_active: boolean,
    public session_id: string | undefined,
    public refresh_token: string | undefined,
    public role_id: string,
    public role?: RoleEntity,
  ) {}

  getPassword(): string {
    return this.password;
  }

  deactivate(): void {
    this.is_active = false;
  }

  static create(props: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    is_active?: boolean;
    role_id: string;
  }): UserModel {
    return new UserModel(
      uuidv7(),
      props.first_name,
      props.last_name,
      props.email,
      props.password,
      props.is_active ?? true,
      undefined,
      undefined,
      props.role_id,
    );
  }

  static toDomain(entity: TUserEntity): UserModel {
    return new UserModel(
      entity.id,
      entity.first_name,
      entity.last_name,
      entity.email,
      entity.password,
      entity.is_active,
      entity.session_id,
      entity.refresh_token,
      entity.role_id,
      entity.role,
    );
  }

  static toEntity(domain: Partial<UserModel>) {
    const entity = new UserEntity({
      id: domain.id,
      first_name: domain.first_name,
      last_name: domain.last_name,
      email: domain.email,
      is_active: domain.is_active,
      role_id: domain.role_id,
    });

    if (domain.role) {
      entity.role = domain.role;
    }

    return entity;
  }

  getPayload(session_id: string) {
    return {
      sub: this.id,
      email: this.email,
      session_id,
    };
  }
}
