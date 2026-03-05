import { Injectable } from '@nestjs/common';
import { UserFunctionalRepository } from './ports';
import { UserModel } from '@libs/core/domain';
import { UserIdNotFoundException } from '@libs/common/exception';

@Injectable()
export class GetUserUseCase {
  constructor(private repository: UserFunctionalRepository) {}

  async getAllEntity() {
    const entities = await this.repository.findAll();
    return entities?.map((item) => UserModel.toEntity(item));
  }

  async getOneEntity(id: string) {
    const entity = await this.repository.findById(id);

    if (!entity) throw new UserIdNotFoundException();

    return UserModel.toEntity(entity);
  }
}
