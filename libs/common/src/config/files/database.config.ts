import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join, resolve } from 'path';

export default () =>
  ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [resolve('dist', 'libs', 'common', 'src', 'entities', '*{.js,.ts}')],
    autoLoadEntities: true,
    migrations: [join('migrations', 'model', '*{.js,.ts}')],
    migrationsTableName: 'migrations',
  }) as TypeOrmModuleOptions;
