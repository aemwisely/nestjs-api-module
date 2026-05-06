import { FileStorageModule, PermissionCoreModule } from '@libs/core/presentation';
import { Module } from '@nestjs/common';
import { MediaObjectController } from './media-object.controller';

@Module({
  imports: [FileStorageModule, PermissionCoreModule],
  controllers: [MediaObjectController],
})
export class MediaObjectModule {}
