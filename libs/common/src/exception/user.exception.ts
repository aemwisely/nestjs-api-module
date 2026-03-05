import { HttpStatus } from '@nestjs/common';
import { BaseHttpException, ErrorType } from './default.exception';
import { EMessage, EModule } from './module.enum';

enum UserFieldCode {
  ID = '01',
  EMAIL = '02',
}

export class UserIdNotFoundException extends BaseHttpException {
  constructor() {
    super({
      menu: EModule.USER,
      type: ErrorType.NOT_FOUND,
      status: HttpStatus.NOT_FOUND,
      fieldCode: UserFieldCode.ID,
      message: EMessage.NOT_FOUND,
    });
  }
}

export class UserEmailNotFoundException extends BaseHttpException {
  constructor() {
    super({
      menu: EModule.USER,
      type: ErrorType.NOT_FOUND,
      status: HttpStatus.NOT_FOUND,
      fieldCode: UserFieldCode.EMAIL,
      message: EMessage.NOT_FOUND,
    });
  }
}
