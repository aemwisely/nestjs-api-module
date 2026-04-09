import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export enum BucketList {
  PUBLIC = 'public',
  DEFAULT = 'backend',
}

export class FileUpload {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  files: Express.Multer.File[];

  @ApiProperty({
    enum: BucketList,
    default: BucketList.DEFAULT,
  })
  @IsNotEmpty()
  bucket: string;
}
