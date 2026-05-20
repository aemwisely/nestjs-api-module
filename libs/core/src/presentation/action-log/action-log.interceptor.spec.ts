import { CallHandler, ExecutionContext } from '@nestjs/common';
import { lastValueFrom, of } from 'rxjs';
import { ActionLogInterceptor } from './action-log.interceptor';
import { ActionLogService } from './action-log.service';

describe('ActionLogInterceptor', () => {
  const createContext = (request: Record<string, any>, response: Record<string, any>) =>
    ({
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
      }),
    }) as ExecutionContext;

  const createNext = (): CallHandler => ({
    handle: () => of({ result: { id: 'resource-1' } }),
  });

  it('stores action logs for mutation requests with account, action, method, ip, and browser', async () => {
    const service = {
      createFromRequest: jest.fn().mockResolvedValue(undefined),
    } as unknown as ActionLogService;
    const interceptor = new ActionLogInterceptor(service);
    const request = {
      method: 'POST',
      originalUrl: '/api/v1/user',
      ip: '10.0.0.9',
      headers: {
        'user-agent': 'Mozilla/5.0',
      },
      body: {
        email: 'admin@example.com',
      },
      user: {
        sub: 'user-1',
        email: 'actor@example.com',
      },
    };

    await lastValueFrom(
      interceptor.intercept(createContext(request, { statusCode: 201 }), createNext()),
    );

    expect(service.createFromRequest).toHaveBeenCalledWith(request, 201);
  });

  it('does not store action logs for read-only requests', async () => {
    const service = {
      createFromRequest: jest.fn().mockResolvedValue(undefined),
    } as unknown as ActionLogService;
    const interceptor = new ActionLogInterceptor(service);
    const request = {
      method: 'GET',
      originalUrl: '/api/v1/user',
      headers: {},
    };

    await lastValueFrom(interceptor.intercept(createContext(request, {}), createNext()));

    expect(service.createFromRequest).not.toHaveBeenCalled();
  });
});
