import { PermissionCoreModule, ReportsCoreModule, UserCoreModule } from '@libs/core/presentation';
import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [ReportsCoreModule, UserCoreModule, PermissionCoreModule],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
