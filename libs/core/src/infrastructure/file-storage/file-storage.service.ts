import dayjs from '@libs/common/base/dayjs/dayjs';
import { FileStorageFunctionalRepository } from '@libs/core/application/file-storage/ports';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { extname } from 'path';

@Injectable()
export class FileStorageService implements FileStorageFunctionalRepository {
  private minioClient: Minio.Client;

  private endpoint: string;
  private port: number;
  private useSSL: boolean;
  private accessKey: string;
  private secretKey: string;

  // รองรับหลาย public bucket
  private publicBuckets: string[];

  constructor(private configService: ConfigService) {
    this.endpoint = this.configService.get<string>('minio.url') ?? '';
    this.port = parseInt(this.configService.get<string>('minio.port') ?? '9000', 10);
    this.useSSL = this.configService.get<boolean>('minio.ssl', false);
    this.accessKey = this.configService.get<string>('minio.access_key') ?? '';
    this.secretKey = this.configService.get<string>('minio.secret_key') ?? '';

    const publicBucket = this.configService.get<string>('minio.public_bucket') ?? 'public';

    this.publicBuckets = [publicBucket];

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

  // =========================
  // Utils
  // =========================
  private getShortFilename(file: Express.Multer.File) {
    const ext = extname(file.originalname);
    const type = ext.replace('.', '').toUpperCase();
    const timestamp = dayjs().format('DDHHmmssSSS');

    return `${type}-${timestamp}${ext}`;
  }

  private isPublicBucket(bucket: string): boolean {
    return this.publicBuckets.includes(bucket);
  }

  // =========================
  // Upload + Get URL
  // =========================
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
      const filename = this.getShortFilename(file);
      const key = `${main_folder}/${sub_folder}/${filename}`;

      await this.minioClient.putObject(bucket, key, file.buffer);

      // ✅ single flow: ใช้ presignedUrl เป็น gateway
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

  // =========================
  // URL Generator (สำคัญ)
  // =========================
  async presignedUrl(
    bucket: string,
    key: string,
    expiry: number = 60 * 60 * 24 * 7,
  ): Promise<string> {
    // ✅ public → direct URL (ไม่ presign)
    if (this.isPublicBucket(bucket)) {
      const protocol = this.useSSL ? 'https:' : 'http:';

      let port = '';
      if (
        (this.useSSL && this.port && this.port !== 443) ||
        (!this.useSSL && this.port && this.port !== 80)
      ) {
        port = `:${this.port}`;
      }

      return `${protocol}//${this.endpoint}${port}/${bucket}/${key}`;
    }

    // ✅ private → presigned URL
    return this.minioClient.presignedGetObject(bucket, key, expiry);
  }
}
