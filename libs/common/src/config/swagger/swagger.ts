import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
    .addBearerAuth({ in: 'header', type: 'http' })
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup(`${prefix}/docs`, app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
};
