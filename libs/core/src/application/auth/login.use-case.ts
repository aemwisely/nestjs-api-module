import { Injectable } from '@nestjs/common';
import { GetUserUseCase } from '../user';
import { IncorrectPasswordException } from '@libs/common/exception';
import { PasswordHasher } from '../hasher';
import { uuidv7 } from 'uuidv7';
import { UpdateUserUseCase } from '../user/update-user.use-case';
import { TokenFunctionalRepository } from '../token';

@Injectable()
export class LoginUseCase {
  constructor(
    private tokenRepository: TokenFunctionalRepository,
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
