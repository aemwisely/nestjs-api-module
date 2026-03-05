import { HttpException, HttpStatus } from '@nestjs/common';
import { EMessage, EModule } from './module.enum';

export enum ErrorType {
  NOT_FOUND = '000',
  VALIDATION = '100',
  DUPLICATE = '200',
  UNAUTHORIZED = '300',
  SERVER_ERROR = '400',
  FORBIDDEN = '500',
  BAD_REQUEST = '600',
}

interface ExceptionOptions {
  menu?: EModule;
  type: ErrorType;
  message?: string;
  status: HttpStatus;
  fieldCode?: string;
}

export class BaseHttpException extends HttpException {
  constructor({ menu, type, message, status, fieldCode }: ExceptionOptions) {
    const errorCode = `E${menu}X${type}F${fieldCode}`;
    super(
      {
        error_code: errorCode,
        error_message: message,
      },
      status,
    );
  }
}

export class BadRequestDefault extends BaseHttpException {
  constructor(menu: EModule) {
    super({
      menu: menu,
      type: ErrorType.BAD_REQUEST,
      status: HttpStatus.BAD_REQUEST,
      message: EMessage.BAD_REQUEST,
    });
  }
}
