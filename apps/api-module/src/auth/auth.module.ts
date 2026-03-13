import { AuthCoreModule } from '@libs/core/presentation/auth';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

@Module({
  imports: [AuthCoreModule],
  controllers: [AuthController],
})
export class AuthModule {}
