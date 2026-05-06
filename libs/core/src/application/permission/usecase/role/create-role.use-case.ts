import { Injectable } from '@nestjs/common';
import { RoleFunctionalRepository } from '../../ports';

@Injectable()
export class CreateRoleUseCase {
  constructor(private roleRepository: RoleFunctionalRepository) {}
}
