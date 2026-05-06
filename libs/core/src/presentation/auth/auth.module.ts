import { Module } from '@nestjs/common';
import { JwtCoreModule } from './jwt.module';
import {
  GetSelfUseCase,
  LoginUseCase,
  RefreshTokenUseCase,
  RevokeTokenUseCase,
  RenewTokenUseCase,
} from '@libs/core/application/auth';
import { UserCoreModule } from '../user';
import { PasswordHasher } from '@libs/core/application';
import { BcryptPasswordHasher } from '@libs/core/infrastructure';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '@libs/common/authentication';

@Module({
  imports: [JwtCoreModule, UserCoreModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [
    LoginUseCase,
    GetSelfUseCase,
    RefreshTokenUseCase,
    RevokeTokenUseCase,
    RenewTokenUseCase,
    { provide: PasswordHasher, useClass: BcryptPasswordHasher },
    JwtStrategy,
  ],
  exports: [
    LoginUseCase,
    GetSelfUseCase,
    RefreshTokenUseCase,
    RevokeTokenUseCase,
    RenewTokenUseCase,
  ],
})
export class AuthCoreModule {}
