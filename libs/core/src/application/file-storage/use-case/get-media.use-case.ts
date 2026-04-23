import { Injectable } from '@nestjs/common';
import { MediaObjectFunctionalRepository } from '../ports';
import { CommonFilter } from '@libs/common/base';
import { FileStorageService } from '@libs/core/infrastructure';
import { IContext } from '@libs/common/decorator';

@Injectable()
export class GetMediaUseCase {
  constructor(
    private repository: MediaObjectFunctionalRepository,
    private fileStorageService: FileStorageService,
  ) {}

  async findAllWithPagination(qs: CommonFilter, context: IContext) {
    const query = this.repository.getQueryPagination(qs);

    if (context) {
      query.andWhere('m.uploader_id = :uploader_id', { uploader_id: context.sub });
    }

    query.orderBy('m.created_at', 'DESC');
    const [raw, total] = await query.getManyAndCount();

    const data = await Promise.all(
      raw.map(async (item) => {
        item.url = await this.fileStorageService.checkAndPresignedUrl(item);

        return item;
      }),
    );

    return {
      result: data,
      total,
      page: qs.page,
      limit: qs.limit,
      pageCount: qs.getPageCount(qs.limit, total),
    };
  }
}
