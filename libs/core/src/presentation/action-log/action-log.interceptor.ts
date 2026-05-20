import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { ActionLogRequest, ActionLogService } from './action-log.service';

@Injectable()
export class ActionLogInterceptor implements NestInterceptor {
  private readonly mutationMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

  constructor(private readonly actionLogService: ActionLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    if (!this.mutationMethods.has(request.method.toUpperCase())) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(() => {
        void this.actionLogService.createFromRequest(
          request as unknown as ActionLogRequest,
          response.statusCode,
        );
      }),
      catchError((error: unknown) => {
        void this.actionLogService.createFromRequest(
          request as unknown as ActionLogRequest,
          response.statusCode || 500,
        );
        return throwError(() => error);
      }),
    );
  }
}
