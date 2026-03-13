import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import DatabaseConfig from './files/database.config';
import MinioConfig from './files/minio.config';
import AuthConfig from './files/auth.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [
        () => ({
          database: DatabaseConfig(),
          minio: MinioConfig(),
          auth: AuthConfig(),
        }),
      ],
    }),
  ],
})
export class ConfigModule {}
