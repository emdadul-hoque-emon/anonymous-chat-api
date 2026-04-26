import { HttpException, HttpStatus } from '@nestjs/common';

export interface AppExceptionPayload {
  code: string;
  message: string;
  meta?: any;
}

export class AppException extends HttpException {
  public readonly code: string;
  public readonly meta?: any;

  constructor(status: HttpStatus, code: string, message: string, meta?: any) {
    super(
      {
        code,
        message,
        ...(meta && { meta }),
      },
      status,
    );

    this.code = code;
    this.meta = meta;

    Error.captureStackTrace(this, this.constructor);
  }
}
