import { JwtRepository } from '@libs/core/infrastructure';
import { Injectable } from '@nestjs/common';
import { GetUserUseCase } from '../user';
import { IncorrectPasswordException } from '@libs/common/exception';
import { PasswordHasher } from '../hasher';

@Injectable()
export class LoginUseCase {
  constructor(
    private jwt: JwtRepository,
    private getUserUseCase: GetUserUseCase,
    private hasher: PasswordHasher,
  ) {}

  async execute(
    email: string,
    password: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const findUser = await this.getUserUseCase.getOneByEmail(email);

      const comparePassword = await this.hasher.compare(password, findUser.getPassword());

      if (!comparePassword) {
        throw new IncorrectPasswordException({ email: findUser.email });
      }

      const payload = findUser.getPayload();

      const accessToken = await this.jwt.generateAccessToken(payload);

      // const [accessToken, refreshToken] = await Promise.all([
      //   this.jwt.generateAccessToken(payload),
      //   this.jwt.generateRefreshToken(payload),
      // ]);

      return { access_token: accessToken, refresh_token: '' };
    } catch (error) {
      throw error;
    }
  }
}
