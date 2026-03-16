import { Module } from '@nestjs/common';
import { JwtCoreModule } from './jwt.module';
import { GetSelfUseCase, LoginUseCase } from '@libs/core/application/auth';
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
    { provide: PasswordHasher, useClass: BcryptPasswordHasher },
    JwtStrategy,
  ],
  exports: [LoginUseCase, GetSelfUseCase],
})
export class AuthCoreModule {}
