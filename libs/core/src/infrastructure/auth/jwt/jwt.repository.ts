import { TokenFunctionalRepository } from '@libs/core/application';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class JwtRepository implements TokenFunctionalRepository {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async generateAccessToken(payload: any): Promise<string> {
    return await this.jwt.signAsync(payload, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn: '15m',
    });
  }

  async generateRefreshToken(payload: any): Promise<string> {
    return await this.jwt.signAsync(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '3d',
    });
  }

  async hashToken(token: string): Promise<string> {
    return await bcrypt.hash(token, 10);
  }
}
