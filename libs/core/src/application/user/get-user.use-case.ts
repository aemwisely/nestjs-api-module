import { Injectable } from '@nestjs/common';
import { UserFunctionalRepository } from './ports';
import { UserModel } from '@libs/core/domain';

@Injectable()
export class GetUserUseCase {
  constructor(private repository: UserFunctionalRepository) {}

  async getAll() {
    const entities = await this.repository.findAll();
    return entities?.map((item) => UserModel.toEntity(item));
  }
}
