import { PasswordHasher } from '@libs/core/application';
import { BcryptPasswordHasher } from '@libs/core/infrastructure';
import { Module } from '@nestjs/common';

@Module({
  providers: [{ provide: PasswordHasher, useClass: BcryptPasswordHasher }, BcryptPasswordHasher],
  exports: [PasswordHasher],
})
export class HasherCoreModule {}
