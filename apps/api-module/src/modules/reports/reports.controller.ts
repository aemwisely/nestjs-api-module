import { Controller, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { Response } from 'express';

@Controller('reports')
@ApiTags('Reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}

  @Post('/xlsx/user')
  async getReportUser(@Res() res: Response) {
    return await this.reportService.getBuildXLSXOfUser(res);
  }
}
