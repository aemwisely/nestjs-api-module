import { Injectable } from '@nestjs/common';
import { MediaObjectFunctionalRepository } from '../ports';
import { IContext } from '@libs/common/decorator';

@Injectable()
export class CreateMediaUseCase {
  constructor(private mediaObjectRepository: MediaObjectFunctionalRepository) {}

  async execute(bucketname: string, files: Express.Multer.File[], context: IContext) {
    return await this.mediaObjectRepository.createMedia(bucketname, files, context);
  }
}
