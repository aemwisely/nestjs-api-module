import { UserEntity } from '@libs/common/entities';
import {
  CreateUserUseCase,
  GetUserUseCase,
  UpdateUserUseCase,
  UserFunctionalRepository,
} from '@libs/core/application';
import { UserTypeOrmRepository } from '@libs/core/infrastructure';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HasherCoreModule } from '../hasher';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), HasherCoreModule],
  providers: [
    {
      provide: UserFunctionalRepository,
      useClass: UserTypeOrmRepository,
    },
    GetUserUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
  ],
  exports: [GetUserUseCase, CreateUserUseCase, UpdateUserUseCase],
})
export class UserCoreModule {}
