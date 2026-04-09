import { FileStorageService } from '@libs/core/infrastructure';
import { Module } from '@nestjs/common';

@Module({
  providers: [FileStorageService],
  exports: [FileStorageService],
})
export class FileStorageModule {}
