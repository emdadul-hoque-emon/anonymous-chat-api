import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { desc, eq, sql } from 'drizzle-orm';
import * as schema from './schema';
import { DATABASE_CONNECTION } from '../database/constant';
import { isUUID } from 'class-validator';
import { httpExceptions } from '../common/exceptions/http.exceptions';

@Injectable()
export class MessagesService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async getMessages(roomId: string) {
    const messages = await this.db.query.messages.findMany({
      where: (message) => eq(message.roomId, sql`${roomId}::uuid`),
      orderBy: (message) => [desc(message.createdAt)],
      with: { user: true },
    });
    return {
      messages: messages.map(({ userId, user, ...message }) => ({
        ...message,
        username: user.username,
      })),
    };
  }

  async createMessage(payload: typeof schema.messages.$inferInsert) {
    return await this.db.insert(schema.messages).values(payload).returning();
  }
}
