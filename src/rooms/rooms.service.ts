import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../database/constant';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { eq } from 'drizzle-orm';
import { roomExceptions } from '../common/exceptions/room.exceptions';
import { DrizzleQueryError } from 'drizzle-orm';
import { httpExceptions } from '../common/exceptions/http.exceptions';

@Injectable()
export class RoomsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async getRooms() {
    const rooms = await this.db.query.rooms
      .findMany({
        with: {
          owner: true,
        },
      })
      .then((res) =>
        res.map(({ owner, ownerId, updatedAt, ...room }) => ({
          ...room,
          createdBy: owner.username,
          activeUsers: 0,
        })),
      );
    return {
      rooms,
    };
  }

  async getRoom(roomId: string) {
    try {
      const room = await this.db.query.rooms.findFirst({
        where: (room) => eq(room.id, roomId),
        with: {
          owner: true,
        },
      });

      if (!room) {
        throw roomExceptions.NOT_FOUND(roomId);
      }

      const { owner, ownerId, updatedAt, ...rest } = room;
      return {
        ...rest,
        activeUsers: 0,
        createdBy: owner.username,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createRoom(payload: typeof schema.rooms.$inferInsert) {
    try {
      const inserted = await this.db
        .insert(schema.rooms)
        .values(payload)
        .returning()
        .then((res) => res[0]);

      const newRoom = await this.db.query.rooms.findFirst({
        where: (room) => eq(room.id, inserted.id),
        with: {
          owner: true,
        },
      });

      if (!newRoom) {
        throw roomExceptions.NOT_FOUND(inserted.id);
      }
      const { owner, ownerId, ...rest } = newRoom;
      return {
        ...rest,
        createdBy: owner.username,
      };
    } catch (error) {
      if (error instanceof DrizzleQueryError) {
        const pgError: any = error.cause;
        if (pgError?.code === '23505') {
          throw roomExceptions.NAME_TAKEN();
        }
        if (pgError?.code === '23503') {
          throw httpExceptions.BAD_REQUEST(pgError?.detail);
        }
      }
      throw error;
    }
  }

  async deleteRoom(roomId: string, userId: string) {
    try {
      const room = await this.db.query.rooms.findFirst({
        where: (room) => eq(room.id, roomId),
      });

      if (!room) {
        throw roomExceptions.NOT_FOUND(roomId);
      }
      if (room.ownerId !== userId) {
        throw httpExceptions.FORBIDDEN(
          'Only the room creator can delete this room',
        );
      }

      await this.db.delete(schema.rooms).where(eq(schema.rooms.id, roomId));
      return { deleted: true };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
