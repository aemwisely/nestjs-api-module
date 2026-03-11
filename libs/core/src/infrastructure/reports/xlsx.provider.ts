import { Injectable } from '@nestjs/common';
import * as exporter from 'excel4node';
import { Response } from 'express';

@Injectable()
export class XLSXProvider {
  constructor() {}

  private buildSheet(naming: string) {
    const workbook = new exporter.Workbook();
    const worksheet = workbook.addWorksheet(naming);

    return { workbook, worksheet };
  }

  private buildHeaderTable(
    worksheet: any,
    titles: string[],
    startRow: number,
  ): { worksheet: any; endRow: number } {
    for (const [index, title] of titles.entries()) {
      worksheet.column(index + 1).setWidth(25);
      worksheet.row(startRow).setHeight(25);
      worksheet.cell(startRow, index + 1).string(title);
    }

    return { worksheet, endRow: startRow };
  }

  private buildDataTable(worksheet: any, dataSheets: string[][], endIndexHeader: number) {
    for (const item of dataSheets) {
      for (const [index, data] of item.entries()) {
        const currentIndex = index + 1;

        worksheet.cell(endIndexHeader + 1, currentIndex).string(data);
      }
    }

    endIndexHeader++;
  }

  async buildFile(
    namingFile: string,
    headers: string[],
    data: string[][],
    response: Response,
  ): Promise<any> {
    const { workbook, worksheet } = this.buildSheet(namingFile);

    const headerIndexStart = 3;

    const { endRow } = this.buildHeaderTable(worksheet, headers, headerIndexStart);

    this.buildDataTable(worksheet, data, endRow);

    workbook.write(`${namingFile}.xlsx`, response);
    return;
  }
}
