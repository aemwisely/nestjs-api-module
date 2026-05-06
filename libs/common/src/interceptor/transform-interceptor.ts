import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { keysToSnakeCase } from '../base';

interface Response<T> {
  data: T;
  timestamp: Date;
}

export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    context.switchToHttp().getResponse();
    return next.handle().pipe(
      map((data) =>
        keysToSnakeCase({
          success: true,
          ...data,
          timestamp: new Date(),
        }),
      ),
    );
  }
}
