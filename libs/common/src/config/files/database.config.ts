import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join, resolve } from 'path';

const isCompiledRuntime = __filename.endsWith('.js');

export default () =>
  ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [
      isCompiledRuntime
        ? resolve('dist', 'libs', 'common', 'src', 'entities', '*.entity.js')
        : resolve('libs', 'common', 'src', 'entities', '*.entity.ts'),
    ],
    autoLoadEntities: true,
    migrations: [join('migrations', 'table', '*{.js,.ts}')],
    migrationsTableName: 'migrations',
  }) as TypeOrmModuleOptions;
