import { BuildReportUseCase } from '@libs/core/application/reports';
import { XLSXProvider } from '@libs/core/infrastructure';
import { Module } from '@nestjs/common';

@Module({
  providers: [BuildReportUseCase, XLSXProvider],
  exports: [BuildReportUseCase],
})
export class ReportsCoreModule {}
