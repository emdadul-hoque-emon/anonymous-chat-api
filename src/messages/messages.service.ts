import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, desc, eq, lt, sql } from 'drizzle-orm';
import * as schema from './schema';
import { DATABASE_CONNECTION } from '../database/constant';
import { httpExceptions } from '../common/exceptions/http.exceptions';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class MessagesService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly redis: RedisService,
  ) {}

  async getMessages(roomId: string, limit = 20, before?: string) {
    let cursorDate: Date | null = null;

    if (before) {
      const cursorMessage = await this.db.query.messages.findFirst({
        where: (m) => eq(m.id, before),
        columns: {
          createdAt: true,
        },
      });

      if (!cursorMessage) {
        throw new Error('Invalid cursor message id');
      }

      cursorDate = cursorMessage.createdAt;
    }

    const messages = await this.db.query.messages.findMany({
      where: (m) => {
        const conditions = [eq(m.roomId, roomId)];

        if (cursorDate) {
          conditions.push(lt(m.createdAt, cursorDate));
        }

        return and(...conditions);
      },
      orderBy: (m) => [desc(m.createdAt)],
      limit: limit + 1,
      with: { user: true },
    });

    let hasMore = false;

    if (messages.length > limit) {
      hasMore = true;
      messages.pop();
    }

    const nextCursor =
      messages.length > 0 ? messages[messages.length - 1].id : null;

    return {
      messages: messages.map(({ user, userId, ...message }) => ({
        ...message,
        username: user.username,
      })),
      hasMore,
      nextCursor,
    };
  }

  async createMessage(payload: typeof schema.messages.$inferInsert) {
    const [message] = await this.db
      .insert(schema.messages)
      .values(payload)
      .returning();

    const fullMessage = await this.db.query.messages.findFirst({
      where: (m) => eq(m.id, message.id),
      with: {
        user: true,
      },
    });

    if (!fullMessage) {
      throw httpExceptions.NOT_FOUND('Message not found');
    }

    const { user, userId, ...rest } = fullMessage;

    await this.redis.pub.publish(
      `room:${payload.roomId}:messages`,
      JSON.stringify(message),
    );
    return { ...rest, username: user.username };
  }
}
