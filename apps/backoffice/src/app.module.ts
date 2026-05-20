import { ConfigModule, DatabaseModule, LoggerConfigModule } from '@libs/common/config';
import { ActionLogModule } from '@libs/core/presentation';
import { Module } from '@nestjs/common';
import { ApiModule } from './modules/api.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    ApiModule,
    DatabaseModule,
    LoggerConfigModule,
    ActionLogModule,
  ],
})
export class AppModule {}
