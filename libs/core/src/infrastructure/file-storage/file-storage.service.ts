import dayjs from '@libs/common/base/dayjs/dayjs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { extname } from 'path';

@Injectable()
export class FileStorageService {
  private minioClient: Minio.Client;

  private publicBucket: string;
  private endpoint: string;
  private port: number;
  private useSSL: boolean;
  private accessKey: string;
  private secretKey: string;

  constructor(
    private configService: ConfigService,
    // @InjectDataSource() private datasource: DataSource,
  ) {
    this.endpoint = this.configService.get<string>('minio.url') ?? '';
    this.port = parseInt(this.configService.get<string>('minio.port') ?? '9000', 10);
    this.useSSL = this.configService.get<boolean>('minio.ssl', false);
    this.accessKey = this.configService.get<string>('minio.access_key') ?? '';
    this.secretKey = this.configService.get<string>('minio.secret_key') ?? '';
    // this.bucket = this.configService.get<string>('minio.bucket') || '';
    this.publicBucket = this.configService.get<string>('minio.bucket_public') || '';

    if (!this.endpoint || !this.port || !this.accessKey || !this.secretKey) {
      throw new Error('Minio configuration values are missing');
    }

    this.minioClient = new Minio.Client({
      endPoint: this.endpoint,
      port: this.port,
      useSSL: this.useSSL,
      accessKey: this.accessKey,
      secretKey: this.secretKey,
    });
  }

  private getShortFileName(file: Express.Multer.File) {
    const ext = extname(file.originalname);

    const type = ext.replace('.', '').toLocaleUpperCase();

    const timestamp = dayjs().format('DDHHmmss');

    return `${type}-${timestamp}${ext}`;
  }

  async putObjectAndPresignUrl(
    bucket: string,
    file: Express.Multer.File,
    main_folder: string,
    sub_folder: string,
  ): Promise<{
    filename: string;
    url: string;
    key: string;
  }> {
    try {
      const filename = this.getShortFileName(file);

      const key = `${main_folder}/${sub_folder}/${filename}`;

      await this.minioClient.putObject(bucket, key, file.buffer);
      const url = await this.presignedUrl(bucket, key);

      return {
        filename,
        url,
        key,
      };
    } catch (error) {
      console.log('🚀 - error:', error);
      throw error;
    }
  }

  async presignedUrl(
    bucket: string,
    key: string,
    expiry: number = 60 * 60 * 24 * 7,
  ): Promise<string> {
    if (bucket === this.publicBucket) {
      const protocol = this.useSSL ? 'https:' : 'http:';

      // Don't include port for standard 443/80
      let port = '';
      if (
        (this.useSSL && this.port && this.port !== 443) ||
        (!this.useSSL && this.port && this.port !== 80)
      ) {
        port = `:${this.port}`;
      }

      return `${protocol}//${this.endpoint}${port}/${bucket}/${key}`;
    }

    // Return presigned URL for private buckets
    return this.minioClient.presignedGetObject(bucket, key, expiry);
  }
}
