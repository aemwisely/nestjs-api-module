import { UserEntity } from '@libs/common/entities';
import { uuidv7 } from 'uuidv7';

export class UserModel {
  constructor(
    public readonly id: string,
    public readonly first_name: string,
    public readonly last_name: string,
    public readonly email: string,
    public readonly password: string,
    public is_active: boolean,
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
  }): UserModel {
    return new UserModel(
      uuidv7(),
      props.first_name,
      props.last_name,
      props.email,
      props.password,
      true,
    );
  }

  static toDomain(entity: UserEntity): UserModel {
    return new UserModel(
      entity.id,
      entity.first_name,
      entity.last_name,
      entity.email,
      entity.password,
      entity.is_active,
    );
  }

  static toEntity(domain: Partial<UserModel>) {
    return {
      id: domain.id,
      first_name: domain.first_name,
      last_name: domain.last_name,
      email: domain.email,
      is_active: domain.is_active,
    };
  }
}
