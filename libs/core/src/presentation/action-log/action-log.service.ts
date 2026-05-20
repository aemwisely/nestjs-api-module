import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IncomingHttpHeaders } from 'http';
import { Repository } from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { IContext } from '@libs/common/decorator';
import { ActionLogEntity } from '@libs/common/entities';

export interface ActionLogRequest {
  method: string;
  originalUrl?: string;
  url?: string;
  ip?: string;
  socket?: {
    remoteAddress?: string;
  };
  headers: IncomingHttpHeaders;
  body?: unknown;
  params?: unknown;
  query?: unknown;
  user?: Partial<IContext>;
}

@Injectable()
export class ActionLogService {
  private readonly logger = new Logger(ActionLogService.name);
  private readonly sensitiveKeys = [
    'accessToken',
    'access_token',
    'authorization',
    'cookie',
    'password',
    'refreshToken',
    'refresh_token',
    'secret',
    'token',
  ];

  constructor(
    @InjectRepository(ActionLogEntity)
    private readonly repository: Repository<ActionLogEntity>,
  ) {}

  async createFromRequest(request: ActionLogRequest, statusCode?: number): Promise<void> {
    try {
      const path = request.originalUrl || request.url || '';
      const method = request.method.toUpperCase();
      const userAgent = request.headers['user-agent'];

      await this.repository.save(
        new ActionLogEntity({
          id: uuidv7(),
          account_id: request.user?.sub ?? null,
          account_email: request.user?.email ?? null,
          action: `${method} ${path}`,
          method,
          path,
          ip_address: this.getIpAddress(request),
          browser: Array.isArray(userAgent) ? userAgent.join(', ') : userAgent || null,
          status_code: statusCode ?? null,
          request_body: this.sanitize(request.body),
          request_params: this.sanitize(request.params),
          request_query: this.sanitize(request.query),
        }),
      );
    } catch (error) {
      this.logger.error('Failed to store action log', error);
    }
  }

  private getIpAddress(request: ActionLogRequest): string | null {
    const forwardedFor = request.headers['x-forwarded-for'];

    if (Array.isArray(forwardedFor)) {
      return forwardedFor[0] ?? null;
    }

    if (typeof forwardedFor === 'string') {
      return forwardedFor.split(',')[0]?.trim() || null;
    }

    return request.ip || request.socket?.remoteAddress || null;
  }

  private sanitize(value: unknown): unknown {
    if (value === null || value === undefined) {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.sanitize(item));
    }

    if (typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([key, item]) => [
          key,
          this.isSensitiveKey(key) ? '[REDACTED]' : this.sanitize(item),
        ]),
      );
    }

    return value;
  }

  private isSensitiveKey(key: string): boolean {
    const normalizedKey = key.toLowerCase();
    return this.sensitiveKeys.some((sensitiveKey) => normalizedKey.includes(sensitiveKey));
  }
}
