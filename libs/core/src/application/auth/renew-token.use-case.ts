import { Injectable } from '@nestjs/common';
import { TokenStorageRepository, TokenFunctionalRepository } from '@libs/core/application/token';
import { IContext } from '@libs/common/decorator';
import { UserUnauthorizedException } from '@libs/common/exception';
import { TokenModel } from '@libs/core/domain/token';

/**
 * Renew Token Use Case
 * Renews/rotates tokens by issuing new ones and revoking old ones
 * Used for security purposes - rotate tokens periodically or on sensitive operations
 */
@Injectable()
export class RenewTokenUseCase {
  constructor(
    private tokenStorageRepository: TokenStorageRepository,
    private tokenFunctionalRepository: TokenFunctionalRepository,
  ) {}

  /**
   * Renew (rotate) the current session's tokens
   * Typically called periodically or after sensitive operations
   * @param context Current user context
   * @param currentAccessToken The current access token to validate ownership
   * @returns New access token and refresh token
   */
  async renewCurrentToken(
    context: IContext,
    currentAccessToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      // Find the current token by access token
      const currentToken = await this.tokenStorageRepository.findByAccessToken(currentAccessToken);

      if (!currentToken) {
        throw new UserUnauthorizedException({
          message: 'Current token not found',
        });
      }

      // Ensure token belongs to the current user
      if (currentToken.user_id !== context.sub) {
        throw new UserUnauthorizedException({
          message: 'Token does not match current user',
        });
      }

      // Verify token is still valid
      if (!currentToken.isValid()) {
        throw new UserUnauthorizedException({
          message: 'Current token is invalid or expired',
        });
      }

      // Generate new tokens
      const payload = {
        sub: currentToken.user_id,
        email: context.email,
        session_id: currentToken.session_id,
      };

      const newAccessToken = await this.tokenFunctionalRepository.generateAccessToken(payload);
      const newRefreshToken = await this.tokenFunctionalRepository.generateRefreshToken(payload);

      // Calculate expiration times
      const now = new Date();
      const accessTokenExpiresIn = 15 * 60 * 1000; // 15 minutes
      const refreshTokenExpiresIn = 3 * 24 * 60 * 60 * 1000; // 3 days

      // Create new token entry
      const renewedToken = TokenModel.create({
        user_id: currentToken.user_id,
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        session_id: currentToken.session_id,
        expires_at: new Date(now.getTime() + accessTokenExpiresIn),
        refresh_expires_at: new Date(now.getTime() + refreshTokenExpiresIn),
      });

      // Save new token and revoke old one
      await this.tokenStorageRepository.saveToken(renewedToken);
      await this.tokenStorageRepository.revokeToken(currentToken.id);

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch (error) {
      if (error instanceof UserUnauthorizedException) {
        throw error;
      }
      throw new UserUnauthorizedException({
        message: 'Token renewal failed',
        error: error.message,
      });
    }
  }

  /**
   * Renew all tokens for a user (emergency rotation)
   * Invalidates all existing tokens and forces login on all devices
   * Useful after security incidents or password changes
   */
  async renewAllUserTokens(context: IContext): Promise<void> {
    try {
      // Revoke all existing tokens
      await this.tokenStorageRepository.revokeAllUserTokens(context.sub);
    } catch (error) {
      throw new UserUnauthorizedException({
        message: 'Failed to renew all user tokens',
        error: error.message,
      });
    }
  }

  /**
   * Check token expiration and provide renewal recommendation
   */
  async checkTokenExpiration(
    context: IContext,
    accessToken: string,
  ): Promise<{
    expires_soon: boolean;
    expires_at: Date;
    hours_until_expiration: number;
  }> {
    try {
      const token = await this.tokenStorageRepository.findByAccessToken(accessToken);

      if (!token) {
        throw new UserUnauthorizedException({
          message: 'Token not found',
        });
      }

      if (token.user_id !== context.sub) {
        throw new UserUnauthorizedException({
          message: 'Token does not match current user',
        });
      }

      const now = new Date();
      const timeUntilExpiration = token.expires_at.getTime() - now.getTime();
      const hoursUntilExpiration = Math.ceil(timeUntilExpiration / (1000 * 60 * 60));
      const expiresSoon = hoursUntilExpiration <= 1; // Consider expired soon if less than 1 hour

      return {
        expires_soon: expiresSoon,
        expires_at: token.expires_at,
        hours_until_expiration: hoursUntilExpiration,
      };
    } catch (error) {
      if (error instanceof UserUnauthorizedException) {
        throw error;
      }
      throw new UserUnauthorizedException({
        message: 'Failed to check token expiration',
        error: error.message,
      });
    }
  }
}
