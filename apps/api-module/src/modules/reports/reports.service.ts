import { BuildReportUseCase } from '@libs/core/application';
import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class ReportsService {
  constructor(private buildReportUseCase: BuildReportUseCase) {}

  async getBuildXLSXOfUser(response: Response) {
    return await this.buildReportUseCase.buildXLSX(
      {
        option: {
          filename: new Date().toISOString(),
          sheet_name: 'Public',
          headers: ['#', 'A', 'B', 'C'],
        },
        data: [['1', 'a', 'b', 'c']],
      },
      response,
    );
  }
}
