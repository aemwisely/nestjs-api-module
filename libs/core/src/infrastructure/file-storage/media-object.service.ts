import { MediaObjectEntity } from '@libs/common/entities';
import { MediaObjectFunctionalRepository } from '@libs/core/application/file-storage';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { FileStorageService } from './file-storage.service';
import dayjs from '@libs/common/base/dayjs/dayjs';

@Injectable()
export class MediaObjectCoreService implements MediaObjectFunctionalRepository {
  constructor(
    @InjectRepository(MediaObjectEntity)
    private mediaObjectRepository: Repository<MediaObjectEntity>,
    private fileStorageService: FileStorageService,
  ) {}

  async createMedia(bucketname: string, files: Express.Multer.File[]) {
    const main = dayjs().format('YYYY');
    const sub = dayjs().format('MM');
    const completeFiles: MediaObjectEntity[] = [];
    try {
      if (files.length > 0) {
        for (const file of files) {
          const { mimetype } = file;

          const { filename, url, key } = await this.fileStorageService.putObjectAndPresignUrl(
            bucketname,
            file,
            main,
            sub,
          );

          const media = this.mediaObjectRepository.create({
            id: uuidv7(),
            name: filename,
            mimetype,
            url,
            bucket: bucketname,
            expire_date: bucketname === 'public' ? undefined : dayjs().add(7, 'day').toISOString(),
            key,
            is_public: bucketname === 'public' ? true : false,
          });

          const savedMedia = await this.mediaObjectRepository.save(media);
          completeFiles.push(savedMedia);
        }
      }
      return completeFiles;
    } catch (error) {
      throw error;
    }
  }
}
