import { ConfigModule, DatabaseModule, LoggerConfigModule } from '@libs/common/config';
import { Module } from '@nestjs/common';
import { ApiModule } from './modules/api.module';

@Module({
  imports: [ConfigModule, ApiModule, DatabaseModule, LoggerConfigModule],
})
export class AppModule {}
