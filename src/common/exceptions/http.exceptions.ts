import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

export const httpExceptions = Object.freeze({
  BAD_REQUEST: (message = 'Bad request', meta?: any) =>
    new AppException(HttpStatus.BAD_REQUEST, 'BAD_REQUEST', message, meta),

  UNAUTHORIZED: (message = 'Unauthorized', meta?: any) =>
    new AppException(HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED', message, meta),

  FORBIDDEN: (message = 'Forbidden', meta?: any) =>
    new AppException(HttpStatus.FORBIDDEN, 'FORBIDDEN', message, meta),

  NOT_FOUND: (message = 'Not found', meta?: any) =>
    new AppException(HttpStatus.NOT_FOUND, 'NOT_FOUND', message, meta),

  CONFLICT: (message = 'Conflict', meta?: any) =>
    new AppException(HttpStatus.CONFLICT, 'CONFLICT', message, meta),

  INTERNAL_SERVER_ERROR: (message = 'Internal server error', meta?: any) =>
    new AppException(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'INTERNAL_SERVER_ERROR',
      message,
      meta,
    ),
});
