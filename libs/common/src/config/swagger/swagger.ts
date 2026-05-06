import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const JWT_ACCESS_TOKEN = 'JWT_ACCESS_TOKEN';
export const JWT_REFRESH_TOKEN = 'JWT_REFRESH_TOKEN';

export const BuildSwaggerDocument = (
  app: INestApplication,
  title: string,
  description: string,
  version: string,
  prefix: string,
) => {
  const options = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: JWT_ACCESS_TOKEN,
        in: 'header',
      },
      JWT_ACCESS_TOKEN,
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: JWT_REFRESH_TOKEN,
        in: 'header',
      },
      JWT_REFRESH_TOKEN,
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup(`${prefix}/docs`, app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
};
