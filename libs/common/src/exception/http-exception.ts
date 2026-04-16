import { ArgumentsHost, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';

export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage: string = 'Internal server error';
    let errorCode: string | number = 'E00X000F00';
    let errorData: any = null;

    const requestId = uuidv7();

    // ✅ handle HttpException (your custom exceptions included)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        errorMessage = res;
      } else if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, any>;

        errorMessage = Array.isArray(resObj.error_message)
          ? resObj.error_message[0]
          : (resObj.error_message ?? resObj.message ?? resObj.error ?? 'Unknown error');

        errorCode = resObj.error_code ?? resObj.code ?? 'E00X000F00';

        // ✅ sanitize data (avoid circular structure)
        errorData = this.safeSerialize(resObj.data);
      }
    }
    // ✅ unknown object error
    else if (exception && typeof exception === 'object') {
      const err = exception as any;

      errorMessage = err.error_message ?? err.message ?? 'Internal server error';
      errorCode = err.error_code ?? 'E00X000F00';
      errorData = this.safeSerialize(err.data);
    }
    // ✅ string / primitive error
    else {
      errorMessage = String(exception);
    }

    // ✅ safe logging (NO circular crash)
    const logging = {
      error_code: errorCode,
      url: request.url,
      method: request.method,
      req_id: requestId,
      message: errorMessage,
      status,
      data: errorData,
    };

    this.logger.error(this.safeStringify(logging));

    // ✅ response (clean, no circular)
    response.status(status).json({
      req_id: requestId,
      timestamp: new Date().toISOString(),
      success: false,
      status,
      error_code: errorCode,
      error_message: errorMessage,
    });
  }

  // 🔥 remove circular + heavy objects (like request)
  private safeSerialize(data: any) {
    if (!data) return null;

    // prevent leaking full request object
    if (data?.context?.url) {
      return {
        path: data.context.url,
        method: data.context.method,
      };
    }

    return this.removeCircular(data);
  }

  // 🔥 safe JSON stringify helper
  private safeStringify(obj: any): string {
    return JSON.stringify(this.removeCircular(obj), null, 2);
  }

  // 🔥 core circular remover
  private removeCircular(obj: any) {
    const seen = new WeakSet();

    return JSON.parse(
      JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) return '[Circular]';
          seen.add(value);
        }

        // ❌ strip dangerous objects
        if (key === 'socket' || key === 'parser') return undefined;

        return value;
      }),
    );
  }
}
