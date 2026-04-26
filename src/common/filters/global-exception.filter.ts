import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DrizzleQueryError } from 'drizzle-orm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_SERVER_ERROR';
    let message = 'Something went wrong';
    let meta: any = null;

    if (exception instanceof DrizzleQueryError) {
      const pgError: any = exception.cause;
      if (pgError?.code === '22P02') {
        status = 400;
        code = 'INVALID_UUID';
        message = 'Invalid UUID format';
      } else if (pgError?.code === '23505') {
        status = 409;
        code = 'UNIQUE_CONSTRAINT_VIOLATION';
        message = 'Duplicate value violates unique constraint';
      }
    }

    if (exception instanceof HttpException) {
      const res: any = exception.getResponse();
      status = exception.getStatus();

      message = res?.message || exception.message || message;

      code = res?.code || this.mapStatusToCode(status);
      meta = res?.meta;

      if (res?.error?.code === 'VALIDATION_ERROR') {
        status = HttpStatus.BAD_REQUEST;
        code = 'VALIDATION_ERROR';
        message = Array.isArray(res.error.message)
          ? res.error.message.join(', ')
          : res.error.message;
      }
    }

    response.status(status).json({
      success: false,
      error: {
        code,
        message: Array.isArray(message) ? message.join(', ') : message,
      },
      ...(process.env.NODE_ENV === 'development' && meta && { meta }),
    });
  }

  private mapStatusToCode(status: number): string {
    switch (status) {
      case 400:
        return 'BAD_REQUEST';
      case 401:
        return 'UNAUTHORIZED';
      case 403:
        return 'FORBIDDEN';
      case 404:
        return 'NOT_FOUND';
      default:
        return 'INTERNAL_SERVER_ERROR';
    }
  }
}
