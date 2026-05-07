import { PermissionCoreModule, UserCoreModule } from '@libs/core/presentation';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';

@Module({
  imports: [UserCoreModule, PermissionCoreModule],
  controllers: [UserController],
})
export class UserModule {}
