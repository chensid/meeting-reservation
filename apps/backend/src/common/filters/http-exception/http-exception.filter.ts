import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = 500;
    let message = '系统错误';
    let code = status;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'object'
          ? Array.isArray(exceptionResponse['message'])
            ? exceptionResponse['message'].join(',')
            : exceptionResponse['message']
          : exceptionResponse;
      code = exceptionResponse['code'] || status;
    }
    response.status(status).json({
      code,
      status,
      message,
    });
  }
}
