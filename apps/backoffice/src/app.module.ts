import { ConfigModule, DatabaseModule, LoggerConfigModule } from '@libs/common/config';
import { Module } from '@nestjs/common';
import { ApiModule } from './modules/api.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule, ConfigModule, ApiModule, DatabaseModule, LoggerConfigModule],
})
export class AppModule {}
