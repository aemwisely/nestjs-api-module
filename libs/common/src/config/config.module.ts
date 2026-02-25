import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import DatabaseConfig from './files/database.config';
import MinioConfig from './files/minio.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [
        () => ({
          database: DatabaseConfig(),
          minio: MinioConfig(),
        }),
      ],
    }),
  ],
})
export class ConfigModule {}
