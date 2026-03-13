import { HttpStatus } from '@nestjs/common';
import { BaseHttpException, ErrorType } from './default.exception';
import { EMessage, EModule } from './module.enum';

export enum UserFieldCode {
  ID = '01',
  EMAIL = '02',
  PASSWORD = '03',
}

export class UserIdNotFoundException extends BaseHttpException {
  constructor(data?: object) {
    super({
      menu: EModule.USER,
      type: ErrorType.NOT_FOUND,
      status: HttpStatus.NOT_FOUND,
      fieldCode: UserFieldCode.ID,
      message: EMessage.NOT_FOUND,
      data,
    });
  }
}

export class UserEmailNotFoundException extends BaseHttpException {
  constructor(data?: object) {
    super({
      menu: EModule.USER,
      type: ErrorType.NOT_FOUND,
      status: HttpStatus.NOT_FOUND,
      fieldCode: UserFieldCode.EMAIL,
      message: EMessage.NOT_FOUND,
      data,
    });
  }
}

export class UserUnauthorizedException extends BaseHttpException {
  constructor(data?: object) {
    super({
      menu: EModule.USER,
      type: ErrorType.UNAUTHORIZED,
      status: HttpStatus.UNAUTHORIZED,
      message: EMessage.UNAUTHORIZED,
      data,
    });
  }
}
