import { AuthCoreModule, PermissionCoreModule } from '@libs/core/presentation';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

@Module({
  imports: [AuthCoreModule, PermissionCoreModule],
  controllers: [AuthController],
})
export class AuthModule {}
