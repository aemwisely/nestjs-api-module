import { MediaObjectEntity } from '@libs/common/entities';
import {
  CreateMediaUseCase,
  MediaObjectFunctionalRepository,
} from '@libs/core/application/file-storage';
import { FileStorageService, MediaObjectCoreService } from '@libs/core/infrastructure';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MediaObjectEntity])],
  providers: [
    FileStorageService,
    { provide: MediaObjectFunctionalRepository, useClass: MediaObjectCoreService },
    MediaObjectCoreService,
    CreateMediaUseCase,
  ],
  exports: [FileStorageService, CreateMediaUseCase],
})
export class FileStorageModule {}
