import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { ActionLogEntity } from '@libs/common/entities';
import { ActionLogService } from './action-log.service';

describe('ActionLogService', () => {
  let service: ActionLogService;
  let repository: jest.Mocked<Pick<Repository<ActionLogEntity>, 'save'>>;

  beforeEach(async () => {
    repository = {
      save: jest.fn().mockResolvedValue(undefined),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        ActionLogService,
        {
          provide: getRepositoryToken(ActionLogEntity),
          useValue: repository,
        },
      ],
    }).compile();

    service = moduleRef.get(ActionLogService);
  });

  it('creates a sanitized action log from an HTTP request', async () => {
    await service.createFromRequest(
      {
        method: 'PATCH',
        originalUrl: '/api/v1/user/123',
        ip: '127.0.0.1',
        headers: {
          'user-agent': 'Chrome',
        },
        params: {
          id: '123',
        },
        body: {
          firstName: 'Ada',
          password: 'secret',
          nested: {
            refreshToken: 'hidden',
          },
        },
        user: {
          sub: 'account-1',
          email: 'ada@example.com',
        },
      },
      200,
    );

    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        account_id: 'account-1',
        account_email: 'ada@example.com',
        action: 'PATCH /api/v1/user/123',
        method: 'PATCH',
        path: '/api/v1/user/123',
        ip_address: '127.0.0.1',
        browser: 'Chrome',
        status_code: 200,
        request_body: {
          firstName: 'Ada',
          password: '[REDACTED]',
          nested: {
            refreshToken: '[REDACTED]',
          },
        },
        request_params: {
          id: '123',
        },
      }),
    );
  });
});
