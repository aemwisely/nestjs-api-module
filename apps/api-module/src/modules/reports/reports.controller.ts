import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { Response } from 'express';
import { JwtGuard } from '@libs/common/authentication';
import { JWT_ACCESS_TOKEN } from '@libs/common/config/swagger';
import { Context, IContext, PermissionModuleCode } from '@libs/common/decorator';
import { EModule } from '@libs/common/exception';
import { PermissionGuard } from '@libs/core/presentation';

@Controller('reports')
@ApiTags('Reports')
@PermissionModuleCode(EModule.REPORT)
@UseGuards(JwtGuard, PermissionGuard)
@ApiBearerAuth(JWT_ACCESS_TOKEN)
export class ReportsController {
  constructor(private reportService: ReportsService) {}

  @Post('/xlsx/user')
  async getReportUser(@Res() res: Response, @Context() context: IContext): Promise<void> {
    await this.reportService.getBuildXLSXOfUser(res, context);
  }
}
