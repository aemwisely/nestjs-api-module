import { CommonFilter } from '@libs/common/base';
import { IContext } from '@libs/common/decorator';
import { MediaObjectEntity } from '@libs/common/entities';
import { SelectQueryBuilder } from 'typeorm';

export abstract class MediaObjectFunctionalRepository {
  abstract createMedia(
    bucketname: string,
    files: Express.Multer.File[],
    context: IContext,
  ): Promise<MediaObjectEntity[]>;

  abstract getQueryPagination(qs: CommonFilter): SelectQueryBuilder<MediaObjectEntity>;
}
