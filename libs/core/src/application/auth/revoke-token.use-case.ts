import { Injectable } from '@nestjs/common';
import { TokenStorageRepository } from '@libs/core/application/token';
import { IContext } from '@libs/common/decorator';
import { UserUnauthorizedException } from '@libs/common/exception';

/**
 * Revoke Token Use Case
 * Allows users to revoke their tokens (logout from specific session or all sessions)
 */
@Injectable()
export class RevokeTokenUseCase {
  constructor(private tokenStorageRepository: TokenStorageRepository) {}

  /**
   * Revoke a specific token by its ID
   * Typically used for "logout from this device" functionality
   */
  async revokeToken(tokenId: string, context: IContext): Promise<void> {
    try {
      const token = await this.tokenStorageRepository.findById(tokenId);

      if (!token) {
        throw new UserUnauthorizedException({
          message: 'Token not found',
        });
      }

      // Ensure user can only revoke their own tokens
      if (token.user_id !== context.sub) {
        throw new UserUnauthorizedException({
          message: 'Unauthorized to revoke this token',
        });
      }

      await this.tokenStorageRepository.revokeToken(tokenId);
    } catch (error) {
      if (error instanceof UserUnauthorizedException) {
        throw error;
      }
      throw new UserUnauthorizedException({
        message: 'Token revocation failed',
        error: error.message,
      });
    }
  }

  /**
   * Revoke all tokens for the current user
   * Useful for "logout from all devices" or password change scenarios
   */
  async revokeAllUserTokens(context: IContext): Promise<void> {
    try {
      await this.tokenStorageRepository.revokeAllUserTokens(context.sub);
    } catch (error) {
      throw new UserUnauthorizedException({
        message: 'Failed to revoke all tokens',
        error: error.message,
      });
    }
  }

  /**
   * Revoke token by refresh token (used during logout)
   */
  async revokeByRefreshToken(refreshToken: string, context: IContext): Promise<void> {
    try {
      const token = await this.tokenStorageRepository.findByRefreshToken(refreshToken);

      if (!token) {
        throw new UserUnauthorizedException({
          message: 'Token not found',
        });
      }

      // Ensure user can only revoke their own tokens
      if (token.user_id !== context.sub) {
        throw new UserUnauthorizedException({
          message: 'Unauthorized to revoke this token',
        });
      }

      await this.tokenStorageRepository.revokeToken(token.id);
    } catch (error) {
      if (error instanceof UserUnauthorizedException) {
        throw error;
      }
      throw new UserUnauthorizedException({
        message: 'Token revocation failed',
        error: error.message,
      });
    }
  }
}
