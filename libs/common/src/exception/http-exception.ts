import { ArgumentsHost, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';

export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status: number;
    let errorMessage: string;
    let errorCode: string | number = '000000';
    let errorData: any = null;
    const requestId = uuidv7();

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      console.log('🚀 - res:', res);

      if (typeof res === 'string') {
        errorMessage = res;
      } else if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, any>;
        errorMessage = Array.isArray(resObj.error_message)
          ? resObj.error_message[0]
          : resObj.error_message
            ? resObj.error_message
            : resObj.error
              ? resObj.error
              : 'Unknown error';
        errorCode = resObj.error_code ?? resObj.code ?? 'E00X000F00';
        errorData = resObj.data ?? null; // 👈 get the `data` property here
      } else {
        errorMessage = 'Unknown HttpException';
      }
    } else if (exception && typeof exception === 'object') {
      // fallback for unknown thrown objects
      errorMessage = (exception as any).error_message ?? 'Internal server error';
      errorCode = (exception as any).error_code ?? 'E00X000F00';
      errorData = (exception as any).data ?? null; // 👈 also check here
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    } else {
      // fallback for non-object errors (e.g., string)
      errorMessage = String(exception);
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    const logging = {
      error_code: errorCode,
      url: request.url,
      req_id: requestId,
      message: errorMessage,
      status,
      data: errorData,
    };

    this.logger.error(JSON.stringify(logging, null, 2));

    response.status(status).json({
      req_id: requestId,
      timestamp: new Date().toISOString(),
      success: false,
      status: status,
      error_code: errorCode,
      error_message: errorMessage,
    });
  }
}
