import dayjs from '@libs/common/base/dayjs/dayjs';
import { Injectable } from '@nestjs/common';
import * as exporter from 'excel4node';
import { Response } from 'express';
import { DataHeaderStyle, HeaderMainStyle } from './style';

@Injectable()
export class XLSXProvider {
  constructor() {}

  private buildSheet(naming: string) {
    const workbook = new exporter.Workbook();
    const worksheet = workbook.addWorksheet(naming);

    return { workbook, worksheet };
  }

  private buildHeaderTable(
    topic: string,
    workbook: any,
    worksheet: any,
    authorized_by: string,
    titles: string[],
    startRow: number,
  ): { worksheet: any; endRow: number } {
    const mainHeaderStyle = HeaderMainStyle(workbook);
    const dataHeaderStyle = DataHeaderStyle(workbook);

    worksheet.row(1).setHeight(35);
    worksheet.row(2).setHeight(35);

    worksheet.cell(1, 1, 1, 3, true).string(`Title: ${topic}`).style(mainHeaderStyle);
    worksheet
      .cell(2, 1, 2, 3, true)
      .string(`At: ${dayjs().format('YYYY-MM-DD , HH:mm')}`)
      .style(mainHeaderStyle);

    worksheet
      .cell(1, 4, 2, 4, true)
      .string(`Authrorized by \n ${authorized_by}`)
      .style(mainHeaderStyle);

    for (const [index, title] of titles.entries()) {
      worksheet.column(index + 1).setWidth(25);
      worksheet.row(startRow).setHeight(25);
      worksheet
        .cell(startRow, index + 1)
        .string(`   ${title}`)
        .style(dataHeaderStyle);
    }

    return { worksheet, endRow: startRow };
  }

  private buildDataTable(worksheet: any, dataSheets: string[][], startRow: number) {
    let currentRow = startRow + 1;

    for (const item of dataSheets) {
      for (const [index, data] of item.entries()) {
        worksheet.cell(currentRow, index + 1).string(`${data ?? ''}`);
      }

      currentRow++;
    }
  }

  buildFile(
    topic: string,
    filename: string,
    sheetName: string,
    authorized_by: string,
    headers: string[],
    data: string[][],
    response: Response,
  ): void {
    const { workbook, worksheet } = this.buildSheet(sheetName);

    const headerIndexStart = 3;

    const { endRow } = this.buildHeaderTable(
      topic,
      workbook,
      worksheet,
      authorized_by,
      headers,
      headerIndexStart,
    );

    this.buildDataTable(worksheet, data, endRow);

    workbook.write(`${filename}.xlsx`, response);
  }
}
