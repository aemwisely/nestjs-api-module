import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ReportsModule } from './reports/reports.module';
import { MediaObjectModule } from './media-object/media-object.module';
import { PermissionModule } from './permission/permission.module';

@Module({
  imports: [UserModule, ReportsModule, MediaObjectModule, PermissionModule],
})
export class ApiModule {}
