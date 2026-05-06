import { Injectable } from '@nestjs/common';
import { UserFunctionalRepository } from './ports';
import { UserModel } from '@libs/core/domain';
import { UserEmailNotFoundException, UserIdNotFoundException } from '@libs/common/exception';
import { CommonFilter } from '@libs/common/base';
import { UserEntity } from '@libs/common/entities';

@Injectable()
export class GetUserUseCase {
  constructor(private repository: UserFunctionalRepository) {}

  async getAllEntity() {
    const entities = await this.repository.findAll();
    return entities?.map((item) => UserModel.toEntity(item));
  }

  async findAllEntityWithPagination(filter: CommonFilter): Promise<[UserEntity[], number]> {
    const { pagination, getOffset, limit } = filter;
    const queryBuilder = this.repository.useQueryBuilder();

    if (pagination) {
      queryBuilder.skip(getOffset(filter)).take(limit);
    }

    const [data, count] = await queryBuilder.getManyAndCount();
    return [data.map((item) => UserModel.toEntity(item)), count];
  }

  async getOneEntity(id: string) {
    const entity = await this.repository.findById(id);

    if (!entity) throw new UserIdNotFoundException();

    return UserModel.toEntity(entity);
  }

  async getOneByEmail(email: string) {
    const entity = await this.repository.findByEmail(email);

    if (!entity) throw new UserEmailNotFoundException();

    return entity;
  }
}
