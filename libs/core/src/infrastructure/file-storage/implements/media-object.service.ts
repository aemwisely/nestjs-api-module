import { MediaObjectEntity } from '@libs/common/entities';
import { MediaObjectFunctionalRepository } from '@libs/core/application/file-storage';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { FileStorageService } from './file-storage.service';
import dayjs from '@libs/common/base/dayjs/dayjs';
import { IContext } from '@libs/common/decorator';
import { CommonFilter } from '@libs/common/base';

@Injectable()
export class MediaObjectCoreService implements MediaObjectFunctionalRepository {
  constructor(
    @InjectRepository(MediaObjectEntity)
    private mediaObjectRepository: Repository<MediaObjectEntity>,
    private fileStorageService: FileStorageService,
  ) {}

  async createMedia(bucketname: string, files: Express.Multer.File[], context: IContext) {
    const main = dayjs().format('YYYY');
    const sub = dayjs().format('MM');
    const completeFiles: MediaObjectEntity[] = [];

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
          uploader_id: context.sub,
        });

        const savedMedia = await this.mediaObjectRepository.save(media);
        completeFiles.push(savedMedia);
      }
    }
    return completeFiles;
  }

  getQueryPagination(qs: CommonFilter): SelectQueryBuilder<MediaObjectEntity> {
    const { pagination, limit } = qs;
    const query = this.mediaObjectRepository.createQueryBuilder('m');

    if (pagination) {
      query.skip(qs.getOffset(qs)).take(limit);
    }

    return query;
  }
}
