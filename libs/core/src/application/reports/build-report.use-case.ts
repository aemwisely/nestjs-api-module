import { XLSXProvider } from '@libs/core/infrastructure';
import { Injectable } from '@nestjs/common';
import { IBuildXLSX } from '../../presentation/reports/interface';
import { Response } from 'express';

@Injectable()
export class BuildReportUseCase {
  constructor(private xlsxProvider: XLSXProvider) {}

  /**
   * Build and stream an XLSX file to the HTTP response.
   *
   * This method delegates the file generation to `xlsxProvider.buildFile`
   * using the configuration provided in the `IBuildXLSX` DTO.
   *
   * @param {IBuildXLSX} dto - Data transfer object containing file options and table data.
   * @param {Response} response - Express response object used to send the generated XLSX file to the client.
   * @returns {Promise<void>} Resolves when the XLSX file has been generated and written to the response stream.
   */
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
