import { Injectable } from '@nestjs/common';
import { MediaObjectFunctionalRepository } from '../ports';

@Injectable()
export class CreateMediaUseCase {
  constructor(private mediaObjectRepository: MediaObjectFunctionalRepository) {}

  async execute(bucketname: string, files: Express.Multer.File[]) {
    return await this.mediaObjectRepository.createMedia(bucketname, files);
  }
}
