import { Injectable } from '@nestjs/common';
import { UserFunctionalRepository } from './ports';
import { UserEntity } from '@libs/common/entities';
import { UserIdNotFoundException } from '@libs/common';

@Injectable()
export class UpdateUserUseCase {
  constructor(private repository: UserFunctionalRepository) {}

  async execute(id: string, body: Partial<UserEntity>) {
    const findEntity = await this.repository.findById(id);

    if (!findEntity) throw new UserIdNotFoundException({ id });

    return await this.repository.update(id, body);
  }
}
