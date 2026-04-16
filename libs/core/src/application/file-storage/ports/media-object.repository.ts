import { MediaObjectEntity } from '@libs/common/entities';

export abstract class MediaObjectFunctionalRepository {
  abstract createMedia(
    bucketname: string,
    files: Express.Multer.File[],
  ): Promise<MediaObjectEntity[]>;
}
