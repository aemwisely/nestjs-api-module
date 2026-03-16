import { IContext } from '@libs/common/decorator';
import { BuildReportUseCase, GetUserUseCase } from '@libs/core/application';
import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class ReportsService {
  constructor(
    private buildReportUseCase: BuildReportUseCase,
    private getUserUseCase: GetUserUseCase,
  ) {}

  async getBuildXLSXOfUser(response: Response, context: IContext) {
    const [findContext, getEntities] = await Promise.all([
      this.getUserUseCase.getOneEntity(context.sub),
      this.getUserUseCase.getAllEntity(),
    ]);

    const mappings = getEntities?.map((item, index) => {
      const count = index + 1;
      return [
        count?.toString(),
        `${item?.first_name} ${item?.last_name}`,
        item?.email || '',
        item?.is_active === true ? 'อยู่ระหว่างการใช้งาน' : 'ปิดการใช้งาน',
      ];
    });

    return await this.buildReportUseCase.buildXLSX(
      {
        option: {
          filename: new Date().toISOString(),
          sheet_name: 'Public',
          headers: ['#', 'ชื่อ-นามสกุล', 'อีเมล', 'สถานะการใช้งาน'],
          topic: 'จัดการผู้ใช้งาน',
          authorized_by: `${findContext.first_name} ${findContext.last_name}`,
        },
        data: mappings,
      },
      response,
    );
  }
}
