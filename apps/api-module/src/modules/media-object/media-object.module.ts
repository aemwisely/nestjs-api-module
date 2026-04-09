import { MediaObjectEntity } from '@libs/common/entities';
import { FileStorageModule } from '@libs/core/presentation';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaObjectService } from './media-object.service';
import { MediaObjectController } from './media-object.controller';

@Module({
  imports: [FileStorageModule, TypeOrmModule.forFeature([MediaObjectEntity])],
  providers: [MediaObjectService],
  controllers: [MediaObjectController],
})
export class MediaObjectModule {}
