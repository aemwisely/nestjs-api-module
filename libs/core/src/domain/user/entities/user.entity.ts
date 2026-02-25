import { UserEntity } from '@libs/common/entities';
import { uuidv7 } from 'uuidv7';

export class UserModel {
  constructor(
    public id: string,
    public first_name: string,
    public last_name: string,
    public email: string,
    private password: string,
    public is_active: boolean,
  ) {}

  getPassword(): string {
    return this.password;
  }

  deactivate() {
    this.is_active = false;
  }

  static create(props: { first_name: string; last_name: string; email: string; password: string }) {
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
}
