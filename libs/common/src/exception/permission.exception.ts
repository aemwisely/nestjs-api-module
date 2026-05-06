import { HttpStatus } from '@nestjs/common';
import { BaseHttpException, ErrorType } from './default.exception';
import { EMessage, EModule } from './module.enum';

export class PermissionForbiddenException extends BaseHttpException {
  constructor(data?: object) {
    super({
      menu: EModule.PERMISSION,
      type: ErrorType.FORBIDDEN,
      status: HttpStatus.FORBIDDEN,
      message: EMessage.FORBIDDEN,
      data,
    });
  }
}
