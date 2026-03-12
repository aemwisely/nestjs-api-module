import { Injectable } from '@nestjs/common';

@Injectable()
export class LoginUseCase {
  constructor() {}

  async execute(
    email: string,
    password: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    return { access_token: '', refresh_token: '' };
  }
}
