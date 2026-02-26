import { UserEntity } from '@libs/common/entities';
import {
  CreateUserUseCase,
  GetUserUseCase,
  PasswordHasher,
  UserFunctionalRepository,
} from '@libs/core/application';
import { BcryptPasswordHasher, UserTypeOrmRepository } from '@libs/core/infrastructure';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    {
      provide: UserFunctionalRepository,
      useClass: UserTypeOrmRepository,
    },
    {
      provide: PasswordHasher,
      useClass: BcryptPasswordHasher,
    },
    GetUserUseCase,
    CreateUserUseCase,
    BcryptPasswordHasher,
  ],
  exports: [GetUserUseCase, CreateUserUseCase, BcryptPasswordHasher],
})
export class UserCoreModule {}
