import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

export const roomExceptions = Object.freeze({
  NOT_FOUND: (roomId: string, message?: string, meta?: any) =>
    new AppException(
      HttpStatus.NOT_FOUND,
      'ROOM_NOT_FOUND',
      message ?? `Room with id ${roomId} does not exist`,
      meta ?? { roomId },
    ),

  NAME_TAKEN: (message?: string, meta?: any) =>
    new AppException(
      HttpStatus.CONFLICT,
      'ROOM_NAME_TAKEN',
      message ?? 'A room with this name already exists',
      meta,
    ),
});
