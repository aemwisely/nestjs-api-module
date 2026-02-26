import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { BuildSwaggerDocument } from '@libs/common/config/swagger/swagger';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);

  const prefix = configService.get('APP_PREFIX', 'api');

  const port = configService.get('APP_PORT', 3000);

  app.setGlobalPrefix(prefix);

  BuildSwaggerDocument(app, 'DOCUMENTATION', 'LIST ALL API', '1.0.0', prefix);

  await app.listen(port, async () => {
    const url = await app.getUrl();
    logger.warn(`:: Application is running on ${url}/${prefix}`);
    logger.warn(`:: Documentation is running on ${url}/${prefix}/docs`);
  });
}

(async () => await bootstrap())();
