import { Injectable } from '@nestjs/common';
import { UserFunctionalRepository } from './ports';

@Injectable()
export class GetUserUseCase {
  constructor(private repository: UserFunctionalRepository) {}

  async getAll() {
    return await this.repository.findAll();
  }
}
