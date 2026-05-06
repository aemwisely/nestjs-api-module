import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { keysToCamelCase } from './case-converter';

@Injectable()
export class SnakeToCamelPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body' && metadata.type !== 'query') {
      return value;
    }

    return keysToCamelCase(value);
  }
}
