import { Injectable } from '@nestjs/common';
import { UserFunctionalRepository } from './ports';
import { CreateUserDto } from '../../presentation/user/dto';
import { BcryptPasswordHasher } from '@libs/core/infrastructure';
import { UserModel } from '@libs/core/domain';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private repository: UserFunctionalRepository,
    private useHash: BcryptPasswordHasher,
  ) {}

  async execute(dto: CreateUserDto) {
    const createEntity = this.repository.create({
      email: dto.email,
      first_name: dto.first_name,
      last_name: dto.last_name,
      password: await this.useHash.hash(dto.password),
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
