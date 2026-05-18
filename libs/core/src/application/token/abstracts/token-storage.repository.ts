import { TokenModel } from '@libs/core/domain/token';

/**
 * Token Storage Repository Port
 * Defines contracts for storing and retrieving tokens
 */
export abstract class TokenStorageRepository {
  /**
   * Save a new token
   */
  abstract saveToken(token: TokenModel): Promise<TokenModel>;

  /**
   * Find token by access token string
   */
  abstract findByAccessToken(accessToken: string): Promise<TokenModel | null>;

  /**
   * Find token by refresh token string
   */
  abstract findByRefreshToken(refreshToken: string): Promise<TokenModel | null>;

  /**
   * Find token by session ID
   */
  abstract findBySessionId(sessionId: string): Promise<TokenModel | null>;

  /**
   * Find token by ID
   */
  abstract findById(id: string): Promise<TokenModel | null>;

  /**
   * Find all active tokens for a user
   */
  abstract findActiveTokensByUserId(userId: string): Promise<TokenModel[]>;

  /**
   * Revoke a token
   */
  abstract revokeToken(tokenId: string): Promise<void>;

  /**
   * Atomically revoke the current token and save the replacement token.
   * Returns null when the current token has already been revoked by another request.
   */
  abstract rotateToken(
    currentTokenId: string,
    replacementToken: TokenModel,
  ): Promise<TokenModel | null>;

  /**
   * Revoke all tokens for a user
   */
  abstract revokeAllUserTokens(userId: string): Promise<void>;

  /**
   * Delete expired tokens (cleanup)
   */
  abstract deleteExpiredTokens(): Promise<number>;

  /**
   * Update token (for renewal)
   */
  abstract updateToken(token: TokenModel): Promise<TokenModel>;
}
