import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import {
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { BuildSwaggerDocument } from '@libs/common/config/swagger/swagger';
import { HttpExceptionFilter, TypeORMExceptionFilter } from '@libs/common/exception';
import { TransformInterceptor } from '@libs/common/interceptor';
import { Logger } from 'nestjs-pino';
import { SnakeToCamelPipe } from '@libs/common/base';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    logger: ['log', 'error'],
  });

  const configService = app.get(ConfigService);
  const logger = app.get(Logger);
  const prefix = configService.get<string>('APP_PREFIX', 'api');
  const port = configService.get<number>('APP_PORT', 3000);
  app.useLogger(logger);

  app.setGlobalPrefix(prefix, {
    exclude: ['/api/*path'],
  });
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  app.enableCors({
    credentials: true,
    origin: (_, callback) => {
      return callback(null, true);
    },
    methods: 'GET,PUT,POST,DELETE,PATCH',
  });

  app.useGlobalFilters(new HttpExceptionFilter(), new TypeORMExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(
    new SnakeToCamelPipe(),
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) => new UnprocessableEntityException(errors),
      enableDebugMessages: false,
    }),
  );

  BuildSwaggerDocument(app, 'DOCUMENTATION', 'LIST ALL API', '1.0.0', prefix);

  await app.listen(port);

  const url = await app.getUrl();
  logger.warn(`:: Application is running on ${url}/${prefix}`);
  logger.warn(`:: Documentation is running on ${url}/${prefix}/docs`);
}

bootstrap().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
