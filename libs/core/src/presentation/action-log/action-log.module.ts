import { ActionLogEntity } from '@libs/common/entities';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionLogInterceptor } from './action-log.interceptor';
import { ActionLogService } from './action-log.service';

@Module({
  imports: [TypeOrmModule.forFeature([ActionLogEntity])],
  providers: [
    ActionLogService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ActionLogInterceptor,
    },
  ],
  exports: [ActionLogService],
})
export class ActionLogModule {}
