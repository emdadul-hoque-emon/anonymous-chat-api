import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

export const userExceptions = Object.freeze({
  NOT_FOUND: (userId: string, message?: string, meta?: any) =>
    new AppException(
      HttpStatus.NOT_FOUND,
      'USER_NOT_FOUND',
      message ?? `User with id ${userId} not found`,
      meta ?? { userId },
    ),

  EMAIL_TAKEN: (email: string, message?: string, meta?: any) =>
    new AppException(
      HttpStatus.CONFLICT,
      'EMAIL_ALREADY_EXISTS',
      message ?? `Email ${email} is already in use`,
      meta ?? { email },
    ),

  INVALID_CREDENTIALS: (message?: string) =>
    new AppException(
      HttpStatus.UNAUTHORIZED,
      'INVALID_CREDENTIALS',
      message ?? 'Invalid email or password',
    ),
});
