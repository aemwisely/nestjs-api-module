import { XLSXProvider } from '@libs/core/infrastructure';
import { Injectable } from '@nestjs/common';
import { IBuildXLSX } from './interface';
import { Response } from 'express';

@Injectable()
export class BuildReportUseCase {
  constructor(private xlsxProvider: XLSXProvider) {}

  async buildXLSX(dto: IBuildXLSX, response: Response) {
    return await this.xlsxProvider.buildFile(
      dto.option.topic,
      dto.option.filename,
      dto.option.sheet_name,
      dto.option.authorized_by,
      dto.option.headers,
      dto.data,
      response,
    );
  }
}
