import { Injectable } from '@nestjs/common';
import { UserFunctionalRepository } from './ports';
import { CreateUserDto } from './dto';
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

    const savedEntity = await this.repository.save(createEntity);

    return UserModel.toEntity(savedEntity);
  }
}
