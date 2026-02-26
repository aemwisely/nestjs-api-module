import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const options = config.get<TypeOrmModuleOptions>('database');

        if (!options) {
          throw new Error('Database configuration not found');
        }

        return options;
      },
    }),
  ],
})
export class DatabaseModule {}
