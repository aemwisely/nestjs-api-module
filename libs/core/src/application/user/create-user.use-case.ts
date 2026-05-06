import { Injectable } from '@nestjs/common';
import { UserFunctionalRepository } from './ports';
import { CreateUserDto } from '../../presentation/user/dto';
import { UserModel } from '@libs/core/domain';
import { PasswordHasher } from '../hasher';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private repository: UserFunctionalRepository,
    private hasher: PasswordHasher,
  ) {}

  async execute(dto: CreateUserDto) {
    const createEntity = UserModel.create({
      email: dto.email,
      first_name: dto.firstName,
      last_name: dto.lastName,
      password: await this.hasher.hash(dto.password),
      role_id: dto.roleId,
    });

    const entity = await this.repository.save(createEntity);

    return UserModel.toEntity({
      id: entity.id,
      first_name: entity.first_name,
      last_name: entity.last_name,
      email: entity.email,
      is_active: entity.is_active,
    });
  }
}
