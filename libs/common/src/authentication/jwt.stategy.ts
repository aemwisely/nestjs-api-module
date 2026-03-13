import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { IContext } from '../decorator';
import { UserEntity } from '../entities';
import { UserUnauthorizedException } from '../exception';

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
    });
  }

  async validate(payload: IContext): Promise<IContext> {
    const user = await this.datasource.manager.findOne(UserEntity, {
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UserUnauthorizedException({ context: payload });
    }

    return {
      sub: user.id,
      email: user.email,
    };
  }
}
