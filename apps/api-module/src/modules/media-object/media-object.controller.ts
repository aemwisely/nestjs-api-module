import { CreateMediaUseCase } from '@libs/core/application/file-storage';
import { BucketList, FileUpload } from '@libs/core/presentation';
import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';

@Controller('media-object')
export class MediaObjectController {
  constructor(private createMediaUseCase: CreateMediaUseCase) {}

  @Post('/')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: { fileSize: 30 * 1024 * 1024, files: 10 },
    }),
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        bucket: {
          type: 'string',
          enum: Object.values(BucketList),
        },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  async created(@UploadedFiles() files: Express.Multer.File[], @Body() body: FileUpload) {
    const data = await this.createMediaUseCase.execute(body.bucket, files);

    return {
      result: data,
    };
  }
}
