import { ConfigModule } from '@libs/common/config';
import { Module } from '@nestjs/common';

@Module({
  imports: [ConfigModule],
})
export class AppModule {}
