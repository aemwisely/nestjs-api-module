import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { IContext } from '../decorator';
import { UserEntity, TokenEntity } from '../entities';
import { UserUnauthorizedException } from '../exception';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private datasource: DataSource,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_SECRET', 'default'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: IContext): Promise<IContext> {
    const user = await this.datasource.manager.findOne(UserEntity, {
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UserUnauthorizedException({ context: payload });
    }

    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

    if (!accessToken || !payload.session_id) {
      throw new UserUnauthorizedException({
        message: 'Token has been revoked or is invalid',
      });
    }

    const token = await this.datasource.manager.findOne(TokenEntity, {
      where: {
        access_token: accessToken,
        session_id: payload.session_id,
        user_id: payload.sub,
        is_revoked: false,
      },
    });

    if (!token) {
      throw new UserUnauthorizedException({
        message: 'Token has been revoked or is invalid',
      });
    }

    return {
      sub: user.id,
      email: user.email,
      session_id: payload.session_id,
    };
  }
}
