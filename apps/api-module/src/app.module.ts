import { ConfigModule, DatabaseModule } from '@libs/common/config';
import { Module } from '@nestjs/common';
import { ApiModule } from './modules/api.module';

@Module({
  imports: [ConfigModule, ApiModule, DatabaseModule],
})
export class AppModule {}
