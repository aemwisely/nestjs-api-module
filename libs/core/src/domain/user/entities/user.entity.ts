import { UserEntity } from '@libs/common/entities';
import { uuidv7 } from 'uuidv7';

export type TUserEntity = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  is_active: boolean;
  role_id: string;
};

export class UserModel {
  constructor(
    public readonly id: string,
    public readonly first_name: string,
    public readonly last_name: string,
    public readonly email: string,
    public readonly password: string,
    public is_active: boolean,
    public role_id: string,
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
    role_id: string;
  }): UserModel {
    return new UserModel(
      uuidv7(),
      props.first_name,
      props.last_name,
      props.email,
      props.password,
      true,
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
      entity.role_id,
    );
  }

  static toEntity(domain: Partial<UserModel>) {
    return new UserEntity({
      id: domain.id,
      first_name: domain.first_name,
      last_name: domain.last_name,
      email: domain.email,
      is_active: domain.is_active,
    });
  }

  getPayload(session_id: string) {
    return {
      sub: this.id,
      email: this.email,
      session_id,
    };
  }
}
