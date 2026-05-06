export enum EModule {
  AUTH = '00',
  USER = '01',
  TOKEN = '02',
  PERMISSION = '03',
  MEDIA_OBJECT = '04',
  REPORT = '05',
}

export enum EMessage {
  NOT_FOUND = 'The requested resource was not found.',
  BAD_REQUEST = 'Invalid request. Please check your input and try again.',
  UNAUTHORIZED = 'Unauthorized access. Please login and try again.',
  TOKEN_INVALID = 'Token is invalid or expired.',
  TOKEN_NOT_FOUND = 'Token was not found or has been revoked.',
  TOKEN_EXPIRED_OR_REVOKED = 'Token is expired or revoked.',
  TOKEN_ALREADY_USED = 'Token has already been used.',
  TOKEN_OWNER_MISMATCH = 'Token does not belong to the current user.',
  TOKEN_OPERATION_FAILED = 'Token operation failed.',
  FORBIDDEN = 'You do not have permission to access this resource.',
}
