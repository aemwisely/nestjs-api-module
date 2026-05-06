import { HttpStatus } from '@nestjs/common';
import { BaseHttpException, ErrorType } from './default.exception';
import { EMessage, EModule } from './module.enum';

export enum TokenFieldCode {
  ACCESS_TOKEN = '01',
  REFRESH_TOKEN = '02',
  TOKEN_ID = '03',
  OWNER = '04',
  OPERATION = '05',
  STATE = '06',
  USAGE = '07',
}

export class AccessTokenInvalidException extends BaseHttpException {
  constructor(data?: object) {
    super({
      menu: EModule.TOKEN,
      type: ErrorType.UNAUTHORIZED,
      status: HttpStatus.UNAUTHORIZED,
      fieldCode: TokenFieldCode.ACCESS_TOKEN,
      message: EMessage.TOKEN_INVALID,
      data,
    });
  }
}

export class RefreshTokenInvalidException extends BaseHttpException {
  constructor(data?: object) {
    super({
      menu: EModule.TOKEN,
      type: ErrorType.UNAUTHORIZED,
      status: HttpStatus.UNAUTHORIZED,
      fieldCode: TokenFieldCode.REFRESH_TOKEN,
      message: EMessage.TOKEN_INVALID,
      data,
    });
  }
}

export class TokenNotFoundException extends BaseHttpException {
  constructor(data?: object) {
    super({
      menu: EModule.TOKEN,
      type: ErrorType.UNAUTHORIZED,
      status: HttpStatus.UNAUTHORIZED,
      fieldCode: TokenFieldCode.TOKEN_ID,
      message: EMessage.TOKEN_NOT_FOUND,
      data,
    });
  }
}

export class TokenExpiredOrRevokedException extends BaseHttpException {
  constructor(data?: object) {
    super({
      menu: EModule.TOKEN,
      type: ErrorType.UNAUTHORIZED,
      status: HttpStatus.UNAUTHORIZED,
      fieldCode: TokenFieldCode.STATE,
      message: EMessage.TOKEN_EXPIRED_OR_REVOKED,
      data,
    });
  }
}

export class TokenAlreadyUsedException extends BaseHttpException {
  constructor(data?: object) {
    super({
      menu: EModule.TOKEN,
      type: ErrorType.UNAUTHORIZED,
      status: HttpStatus.UNAUTHORIZED,
      fieldCode: TokenFieldCode.USAGE,
      message: EMessage.TOKEN_ALREADY_USED,
      data,
    });
  }
}

export class TokenOwnerMismatchException extends BaseHttpException {
  constructor(data?: object) {
    super({
      menu: EModule.TOKEN,
      type: ErrorType.FORBIDDEN,
      status: HttpStatus.FORBIDDEN,
      fieldCode: TokenFieldCode.OWNER,
      message: EMessage.TOKEN_OWNER_MISMATCH,
      data,
    });
  }
}

export class TokenOperationFailedException extends BaseHttpException {
  constructor(data?: object) {
    super({
      menu: EModule.TOKEN,
      type: ErrorType.SERVER_ERROR,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      fieldCode: TokenFieldCode.OPERATION,
      message: EMessage.TOKEN_OPERATION_FAILED,
      data,
    });
  }
}
