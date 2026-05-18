import { Injectable } from '@nestjs/common';
import { TokenStorageRepository, TokenFunctionalRepository } from '@libs/core/application/token';
import { GetUserUseCase } from '../user';
import { UpdateUserUseCase } from '../user/update-user.use-case';
import {
  BaseHttpException,
  RefreshTokenInvalidException,
  TokenAlreadyUsedException,
  TokenExpiredOrRevokedException,
  TokenNotFoundException,
  TokenOperationFailedException,
  TokenOwnerMismatchException,
  UserUnauthorizedException,
} from '@libs/common/exception';
import { TokenModel } from '@libs/core/domain/token';

/**
 * Refresh Token Use Case
 * Allows users to obtain a new access token using their refresh token
 * Optionally renews the refresh token as well (token rotation)
 */
@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private tokenStorageRepository: TokenStorageRepository,
    private tokenFunctionalRepository: TokenFunctionalRepository,
    private getUserUseCase: GetUserUseCase,
    private updateUserUseCase: UpdateUserUseCase,
  ) {}

  /**
   * Execute refresh token flow
   * @param refreshToken The refresh token provided by the client
   * @param renewRefreshToken If true, also generates a new refresh token (rotation)
   * @returns New access token and optionally new refresh token
   */
  async execute(
    refreshToken: string,
    renewRefreshToken: boolean = true,
  ): Promise<{ access_token: string; refresh_token?: string }> {
    try {
      // Verify the refresh token signature and get its payload
      const payload = await this.tokenFunctionalRepository.verifyRefreshToken(refreshToken);

      if (!payload) {
        throw new RefreshTokenInvalidException();
      }

      // Find token in storage
      const storedToken = await this.tokenStorageRepository.findByRefreshToken(refreshToken);

      if (!storedToken) {
        throw new TokenNotFoundException();
      }

      if (payload.sub !== storedToken.user_id || payload.session_id !== storedToken.session_id) {
        throw new TokenOwnerMismatchException({ user_id: storedToken.user_id });
      }

      // Check if token is still valid
      if (!storedToken.isRefreshTokenValid()) {
        throw new TokenExpiredOrRevokedException();
      }

      // Get user information
      const user = await this.getUserUseCase.getOneEntity(storedToken.user_id);

      if (!user) {
        throw new TokenOwnerMismatchException({ user_id: storedToken.user_id });
      }

      if (!user.is_active) {
        throw new UserUnauthorizedException({ email: user.email });
      }

      const tokenPayload = {
        sub: storedToken.user_id,
        email: user.email,
        session_id: storedToken.session_id,
      };

      const newAccessToken = await this.tokenFunctionalRepository.generateAccessToken(tokenPayload);

      let newRefreshToken: string | undefined;
      let updatedToken = storedToken;
      const now = new Date();
      const accessTokenExpiresIn = 15 * 60 * 1000; // 15 minutes

      // If token rotation is enabled, generate new refresh token
      if (renewRefreshToken) {
        newRefreshToken = await this.tokenFunctionalRepository.generateRefreshToken(tokenPayload);

        // Calculate expiration times
        const refreshTokenExpiresIn = 3 * 24 * 60 * 60 * 1000; // 3 days

        // Create new token entry with rotated tokens
        const newToken = TokenModel.create({
          user_id: storedToken.user_id,
          access_token: newAccessToken,
          refresh_token: newRefreshToken,
          session_id: storedToken.session_id,
          expires_at: new Date(now.getTime() + accessTokenExpiresIn),
          refresh_expires_at: new Date(now.getTime() + refreshTokenExpiresIn),
        });

        const rotatedToken = await this.tokenStorageRepository.rotateToken(
          storedToken.id,
          newToken,
        );

        if (!rotatedToken) {
          throw new TokenAlreadyUsedException();
        }

        updatedToken = rotatedToken;
      } else {
        newRefreshToken = refreshToken;
        updatedToken = await this.tokenStorageRepository.updateToken(
          storedToken.withAccessToken(
            newAccessToken,
            new Date(now.getTime() + accessTokenExpiresIn),
          ),
        );
      }

      // Update user's current session and refresh token
      await this.updateUserUseCase.execute(storedToken.user_id, {
        session_id: updatedToken.session_id,
        refresh_token: updatedToken.refresh_token,
      });

      return {
        access_token: newAccessToken,
        refresh_token: renewRefreshToken ? newRefreshToken : undefined,
      };
    } catch (error) {
      if (error instanceof BaseHttpException) {
        throw error;
      }
      throw new TokenOperationFailedException({ error: error.message });
    }
  }
}
