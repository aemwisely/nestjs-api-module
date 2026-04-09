import dayjs from '@libs/common/base/dayjs/dayjs';
import { MediaObjectEntity } from '@libs/common/entities';
import { FileStorageService } from '@libs/core/infrastructure';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class MediaObjectService {
  constructor(
    @InjectRepository(MediaObjectEntity)
    private mediaObjectRepository: Repository<MediaObjectEntity>,
    private fileStorageService: FileStorageService,
  ) {}

  async createMedia(bucketname: string, files: Express.Multer.File[]) {
    const main = dayjs().format('YYYY');
    const sub = dayjs().format('MM');

    try {
      return await Promise.all(
        files.map(async (file) => {
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
            expire_date: dayjs().add(7, 'day').toISOString(),
            key,
          });

          return this.mediaObjectRepository.save(media);
        }),
      );
    } catch (error) {
      throw error;
    }
  }
}
