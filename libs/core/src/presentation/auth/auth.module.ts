import { Module } from '@nestjs/common';
import { JwtCoreModule } from './jwt.module';
import { LoginUseCase } from '@libs/core/application/auth';
import { UserCoreModule } from '../user';
import { PasswordHasher } from '@libs/core/application';
import { BcryptPasswordHasher } from '@libs/core/infrastructure';

@Module({
  imports: [JwtCoreModule, UserCoreModule],
  providers: [LoginUseCase, { provide: PasswordHasher, useClass: BcryptPasswordHasher }],
  exports: [LoginUseCase],
})
export class AuthCoreModule {}
