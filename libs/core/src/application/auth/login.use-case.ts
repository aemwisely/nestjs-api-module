import { Injectable } from '@nestjs/common';
import { GetUserUseCase } from '../user';
import { IncorrectPasswordException } from '@libs/common/exception';
import { PasswordHasher } from '../hasher';
import { uuidv7 } from 'uuidv7';
import { UpdateUserUseCase } from '../user/update-user.use-case';
import { TokenFunctionalRepository, TokenStorageRepository } from '../token';
import { TokenModel } from '@libs/core/domain/token';

@Injectable()
export class LoginUseCase {
  constructor(
    private tokenRepository: TokenFunctionalRepository,
    private tokenStorageRepository: TokenStorageRepository,
    private getUserUseCase: GetUserUseCase,
    private updateUserUseCase: UpdateUserUseCase,
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

      const generateSession = uuidv7();

      const payload = findUser.getPayload(generateSession);

      const [accessToken, refreshToken] = await Promise.all([
        this.tokenRepository.generateAccessToken(payload),
        this.tokenRepository.generateRefreshToken(payload),
      ]);

      const now = new Date();
      const accessTokenExpiresIn = 15 * 60 * 1000;
      const refreshTokenExpiresIn = 3 * 24 * 60 * 60 * 1000;

      const token = TokenModel.create({
        user_id: findUser.id,
        access_token: accessToken,
        refresh_token: refreshToken,
        session_id: generateSession,
        expires_at: new Date(now.getTime() + accessTokenExpiresIn),
        refresh_expires_at: new Date(now.getTime() + refreshTokenExpiresIn),
      });

      await this.tokenStorageRepository.saveToken(token);

      await this.updateUserUseCase.execute(findUser.id, {
        session_id: generateSession,
        refresh_token: refreshToken,
      });

      return { access_token: accessToken, refresh_token: refreshToken };
    } catch (error) {
      throw error;
    }
  }
}
