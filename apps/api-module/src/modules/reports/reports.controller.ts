import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { Response } from 'express';
import { JwtGuard } from '@libs/common/authentication';
import { Context, IContext } from '@libs/common/decorator';

@Controller('reports')
@ApiTags('Reports')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private reportService: ReportsService) {}

  @Post('/xlsx/user')
  async getReportUser(@Res() res: Response, @Context() context: IContext) {
    return await this.reportService.getBuildXLSXOfUser(res, context);
  }
}
