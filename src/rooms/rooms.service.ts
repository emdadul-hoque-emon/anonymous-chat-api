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
        res.map(({ owner, ownerId, ...room }) => ({
          ...room,
          createdBy: owner.username,
        })),
      );
    return {
      rooms,
    };
  }

  async getRoom(roomId: string) {
    try {
      const room = await this.db.query.rooms.findFirst({
        where: (room) => eq(room.name, roomId),
        with: {
          owner: {
            columns: { id: true, username: true },
          },
        },
      });

      if (!room) {
        throw roomExceptions.NOT_FOUND(roomId);
      }
      return {
        room,
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
}
