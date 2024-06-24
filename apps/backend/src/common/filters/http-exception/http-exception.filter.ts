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
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const message =
      typeof exceptionResponse === 'object'
        ? Array.isArray(exceptionResponse['message'])
          ? exceptionResponse['message'].join(',')
          : exceptionResponse['message']
        : exceptionResponse;
    const code = exceptionResponse['code'] || exception.name;
    response.status(status).json({
      code,
      status,
      message,
    });
  }
}
