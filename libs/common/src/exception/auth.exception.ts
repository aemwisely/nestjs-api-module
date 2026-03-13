import { HttpStatus } from '@nestjs/common';
import { BaseHttpException, ErrorType } from './default.exception';
import { EMessage, EModule } from './module.enum';
import { UserFieldCode } from './user.exception';

export class IncorrectPasswordException extends BaseHttpException {
  constructor(data?: object) {
    super({
      menu: EModule.AUTH,
      type: ErrorType.VALIDATION,
      status: HttpStatus.BAD_REQUEST,
      fieldCode: UserFieldCode.PASSWORD,
      message: EMessage.BAD_REQUEST,
      data,
    });
  }
}
