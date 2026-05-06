import { uuidv7 } from 'uuidv7';

export type TTokenEntity = {
  id: string;
  user_id: string;
  access_token: string;
  refresh_token: string;
  session_id: string;
  is_revoked: boolean;
  expires_at: Date;
  refresh_expires_at: Date;
  created_at?: Date;
  updated_at?: Date;
};

/**
 * Token Domain Entity
 * Responsible for managing token lifecycle with revocation capability
 */
export class TokenModel {
  constructor(
    public readonly id: string,
    public readonly user_id: string,
    public readonly access_token: string,
    public readonly refresh_token: string,
    public readonly session_id: string,
    public is_revoked: boolean,
    public readonly expires_at: Date,
    public readonly refresh_expires_at: Date,
    public readonly created_at: Date,
    public readonly updated_at: Date,
  ) {}

  /**
   * Check if token is expired
   */
  isAccessTokenExpired(): boolean {
    return new Date() > this.expires_at;
  }

  /**
   * Check if refresh token is expired
   */
  isRefreshTokenExpired(): boolean {
    return new Date() > this.refresh_expires_at;
  }

  /**
   * Check if token is valid (not revoked and not expired)
   */
  isValid(): boolean {
    return !this.is_revoked && !this.isAccessTokenExpired();
  }

  /**
   * Check if refresh token is still valid
   */
  isRefreshTokenValid(): boolean {
    return !this.is_revoked && !this.isRefreshTokenExpired();
  }

  /**
   * Revoke the token
   */
  revoke(): void {
    this.is_revoked = true;
  }

  /**
   * Create a new token model
   */
  static create(props: {
    user_id: string;
    access_token: string;
    refresh_token: string;
    session_id: string;
    expires_at: Date;
    refresh_expires_at: Date;
  }): TokenModel {
    return new TokenModel(
      uuidv7(),
      props.user_id,
      props.access_token,
      props.refresh_token,
      props.session_id,
      false,
      props.expires_at,
      props.refresh_expires_at,
      new Date(),
      new Date(),
    );
  }

  /**
   * Convert from persistence entity to domain model
   */
  static toDomain(entity: TTokenEntity): TokenModel {
    return new TokenModel(
      entity.id,
      entity.user_id,
      entity.access_token,
      entity.refresh_token,
      entity.session_id,
      entity.is_revoked,
      entity.expires_at,
      entity.refresh_expires_at,
      entity.created_at!,
      entity.updated_at!,
    );
  }

  /**
   * Convert domain model to persistence entity
   */
  static toEntity(domain: TokenModel): TTokenEntity {
    return {
      id: domain.id,
      user_id: domain.user_id,
      access_token: domain.access_token,
      refresh_token: domain.refresh_token,
      session_id: domain.session_id,
      is_revoked: domain.is_revoked,
      expires_at: domain.expires_at,
      refresh_expires_at: domain.refresh_expires_at,
      created_at: domain.created_at,
      updated_at: domain.updated_at,
    };
  }
}
