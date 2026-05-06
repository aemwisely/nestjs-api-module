import { JwtGuard } from '@libs/common/authentication';
import { CommonFilter } from '@libs/common/base';
import { JWT_ACCESS_TOKEN } from '@libs/common/config/swagger';
import { Context, IContext } from '@libs/common/decorator';
import { CreateMediaUseCase, GetMediaUseCase } from '@libs/core/application/file-storage';
import { BucketList, FileUpload, PermissionGuard } from '@libs/core/presentation';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@Controller('media-object')
@ApiTags('Media-object')
@UseGuards(JwtGuard, PermissionGuard)
@ApiBearerAuth(JWT_ACCESS_TOKEN)
export class MediaObjectController {
  constructor(
    private createMediaUseCase: CreateMediaUseCase,
    private getMediaUseCase: GetMediaUseCase,
  ) {}

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
  async created(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: FileUpload,
    @Context() context: IContext,
  ) {
    const data = await this.createMediaUseCase.execute(body.bucket, files, context);

    return {
      result: data,
    };
  }

  @Get('/')
  async findAllWithPagination(@Query() qs: CommonFilter, @Context() context: IContext) {
    return await this.getMediaUseCase.findAllWithPagination(qs, context);
  }
}
