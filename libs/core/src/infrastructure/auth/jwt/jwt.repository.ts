import { TokenFunctionalRepository } from '@libs/core/application';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { StringValue } from 'ms';

/**
 * JWT Repository
 * Handles token generation and validation
 * Supports both access and refresh tokens with configurable expiration
 */
@Injectable()
export class JwtRepository implements TokenFunctionalRepository {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  private getAccessTokenExpiration(): StringValue {
    return this.config.get<string>('JWT_EXPIRATION', '15m') as StringValue;
  }

  private getRefreshTokenExpiration(): StringValue {
    return this.config.get<string>('JWT_REFRESH_EXPIRATION', '3d') as StringValue;
  }

  /**
   * Generate access token with 15 minute expiration
   */
  async generateAccessToken(payload: any): Promise<string> {
    return await this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow<string>('JWT_SECRET'),
      expiresIn: this.getAccessTokenExpiration(),
    });
  }

  /**
   * Generate refresh token with 3 day expiration
   */
  async generateRefreshToken(payload: any): Promise<string> {
    return await this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.getRefreshTokenExpiration(),
    });
  }

  /**
   * Hash token for secure storage
   */
  async hashToken(token: string): Promise<string> {
    return await bcrypt.hash(token, 10);
  }

  /**
   * Verify access token
   */
  async verifyAccessToken(token: string): Promise<any> {
    try {
      return await this.jwt.verifyAsync(token, {
        secret: this.config.getOrThrow<string>('JWT_SECRET'),
      });
    } catch {
      return null;
    }
  }

  /**
   * Verify refresh token
   */
  async verifyRefreshToken(token: string): Promise<any> {
    try {
      return await this.jwt.verifyAsync(token, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      return null;
    }
  }
}
