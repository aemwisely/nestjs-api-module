import { TokenFunctionalRepository, TokenStorageRepository } from '@libs/core/application';
import { JwtRepository } from '@libs/core/infrastructure/auth';
import { TokenRepositoryImpl } from '@libs/core/infrastructure/auth/token';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenEntity } from '@libs/common/entities';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
    }),
    TypeOrmModule.forFeature([TokenEntity]),
  ],
  providers: [
    { provide: TokenFunctionalRepository, useClass: JwtRepository },
    { provide: TokenStorageRepository, useClass: TokenRepositoryImpl },
  ],
  exports: [TokenFunctionalRepository, TokenStorageRepository],
})
export class JwtCoreModule {}
