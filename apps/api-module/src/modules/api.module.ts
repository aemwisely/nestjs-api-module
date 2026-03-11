import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [UserModule, ReportsModule],
})
export class ApiModule {}
