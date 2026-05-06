import { Injectable } from '@nestjs/common';
import { DataSource, LessThan, Repository } from 'typeorm';
import { TokenStorageRepository } from '@libs/core/application/token';
import { TokenModel } from '@libs/core/domain/token';
import { TokenEntity } from '@libs/common/entities';

/**
 * Token Storage Repository Implementation
 * Manages token persistence in PostgreSQL database
 * Supports token storage, retrieval, revocation, and cleanup
 */
@Injectable()
export class TokenRepositoryImpl implements TokenStorageRepository {
  private repository: Repository<TokenEntity>;

  constructor(private datasource: DataSource) {
    this.repository = this.datasource.getRepository(TokenEntity);
  }

  /**
   * Save a new token
   */
  async saveToken(token: TokenModel): Promise<TokenModel> {
    const tokenData = TokenModel.toEntity(token);
    const saved = await this.repository.save(
      new TokenEntity({
        id: tokenData.id,
        user_id: tokenData.user_id,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        session_id: tokenData.session_id,
        is_revoked: tokenData.is_revoked,
        expires_at: tokenData.expires_at,
        refresh_expires_at: tokenData.refresh_expires_at,
      }),
    );

    return TokenModel.toDomain({
      ...tokenData,
      created_at: saved.created_at,
      updated_at: saved.updated_at,
    });
  }

  /**
   * Find token by access token string
   */
  async findByAccessToken(accessToken: string): Promise<TokenModel | null> {
    const token = await this.repository.findOne({
      where: { access_token: accessToken, is_revoked: false },
    });

    if (!token) return null;

    return TokenModel.toDomain({
      id: token.id,
      user_id: token.user_id,
      access_token: token.access_token,
      refresh_token: token.refresh_token,
      session_id: token.session_id,
      is_revoked: token.is_revoked,
      expires_at: token.expires_at,
      refresh_expires_at: token.refresh_expires_at,
      created_at: token.created_at,
      updated_at: token.updated_at,
    });
  }

  /**
   * Find token by refresh token string
   */
  async findByRefreshToken(refreshToken: string): Promise<TokenModel | null> {
    const token = await this.repository.findOne({
      where: { refresh_token: refreshToken, is_revoked: false },
    });

    if (!token) return null;

    return TokenModel.toDomain({
      id: token.id,
      user_id: token.user_id,
      access_token: token.access_token,
      refresh_token: token.refresh_token,
      session_id: token.session_id,
      is_revoked: token.is_revoked,
      expires_at: token.expires_at,
      refresh_expires_at: token.refresh_expires_at,
      created_at: token.created_at,
      updated_at: token.updated_at,
    });
  }

  /**
   * Find token by session ID
   */
  async findBySessionId(sessionId: string): Promise<TokenModel | null> {
    const token = await this.repository.findOne({
      where: { session_id: sessionId, is_revoked: false },
    });

    if (!token) return null;

    return TokenModel.toDomain({
      id: token.id,
      user_id: token.user_id,
      access_token: token.access_token,
      refresh_token: token.refresh_token,
      session_id: token.session_id,
      is_revoked: token.is_revoked,
      expires_at: token.expires_at,
      refresh_expires_at: token.refresh_expires_at,
      created_at: token.created_at,
      updated_at: token.updated_at,
    });
  }

  /**
   * Find token by ID
   */
  async findById(id: string): Promise<TokenModel | null> {
    const token = await this.repository.findOne({
      where: { id },
    });

    if (!token) return null;

    return TokenModel.toDomain({
      id: token.id,
      user_id: token.user_id,
      access_token: token.access_token,
      refresh_token: token.refresh_token,
      session_id: token.session_id,
      is_revoked: token.is_revoked,
      expires_at: token.expires_at,
      refresh_expires_at: token.refresh_expires_at,
      created_at: token.created_at,
      updated_at: token.updated_at,
    });
  }

  /**
   * Find all active tokens for a user
   */
  async findActiveTokensByUserId(userId: string): Promise<TokenModel[]> {
    const tokens = await this.repository.find({
      where: { user_id: userId, is_revoked: false },
      order: { created_at: 'DESC' },
    });

    return tokens.map((token) =>
      TokenModel.toDomain({
        id: token.id,
        user_id: token.user_id,
        access_token: token.access_token,
        refresh_token: token.refresh_token,
        session_id: token.session_id,
        is_revoked: token.is_revoked,
        expires_at: token.expires_at,
        refresh_expires_at: token.refresh_expires_at,
        created_at: token.created_at,
        updated_at: token.updated_at,
      }),
    );
  }

  /**
   * Revoke a token
   */
  async revokeToken(tokenId: string): Promise<void> {
    await this.repository.update({ id: tokenId }, { is_revoked: true });
  }

  /**
   * Revoke all tokens for a user
   */
  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.repository.update({ user_id: userId }, { is_revoked: true });
  }

  /**
   * Delete expired tokens (cleanup for old tokens)
   */
  async deleteExpiredTokens(): Promise<number> {
    const now = new Date();

    const result = await this.repository.delete({
      refresh_expires_at: LessThan(now),
    });

    return result.affected || 0;
  }

  /**
   * Update token (for renewal)
   */
  async updateToken(token: TokenModel): Promise<TokenModel> {
    const tokenData = TokenModel.toEntity(token);
    await this.repository.update(
      { id: tokenData.id },
      {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        is_revoked: tokenData.is_revoked,
        expires_at: tokenData.expires_at,
        refresh_expires_at: tokenData.refresh_expires_at,
      },
    );

    const updated = await this.repository.findOne({
      where: { id: tokenData.id },
    });

    if (!updated) {
      throw new Error('Token update failed');
    }

    return TokenModel.toDomain({
      id: updated.id,
      user_id: updated.user_id,
      access_token: updated.access_token,
      refresh_token: updated.refresh_token,
      session_id: updated.session_id,
      is_revoked: updated.is_revoked,
      expires_at: updated.expires_at,
      refresh_expires_at: updated.refresh_expires_at,
      created_at: updated.created_at,
      updated_at: updated.updated_at,
    });
  }
}
