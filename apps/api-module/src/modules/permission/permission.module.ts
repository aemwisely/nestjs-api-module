import { PermissionCoreModule } from '@libs/core/presentation';
import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';

@Module({
  imports: [PermissionCoreModule],
  controllers: [PermissionController],
})
export class PermissionModule {}
