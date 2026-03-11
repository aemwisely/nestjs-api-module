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
          topic: 'User management',
        },
        data: [
          ['1', 'a', 'b', 'c'],
          ['2', 'a', 'b', 'c'],
          ['3', 'a', 'b', 'c'],
          ['4', 'a', 'b', 'c'],
          ['5', 'a', 'b', 'c'],
          ['6', 'a', 'b', 'c'],
          ['7', 'a', 'b', 'c'],
        ],
      },
      response,
    );
  }
}
