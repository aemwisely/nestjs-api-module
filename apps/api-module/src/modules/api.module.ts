import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ReportsModule } from './reports/reports.module';
import { MediaObjectModule } from './media-object/media-object.module';

@Module({
  imports: [UserModule, ReportsModule, MediaObjectModule],
})
export class ApiModule {}
