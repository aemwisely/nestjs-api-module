export enum EModule {
  AUTH = '00',
  USER = '01',
}

export enum EMessage {
  NOT_FOUND = 'The requested resource was not found.',
  BAD_REQUEST = 'Invalid request. Please check your input and try again.',
  UNAUTHORIZED = 'Unauthorized access. Please login and try again.',
}
