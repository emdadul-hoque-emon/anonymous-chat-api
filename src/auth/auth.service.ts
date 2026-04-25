import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../database/constant';
import * as schema from '../users/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async login(payload: typeof schema.users.$inferInsert) {
    const user = await this.database.query.users.findFirst({
      where: (user) => eq(user.username, payload.username),
    });

    if (user) {
      return {
        user,
        sessionToken: 'token',
        isNewUser: false,
      };
    } else {
      const newUser = await this.database
        .insert(schema.users)
        .values(payload)
        .returning();
      return {
        user: newUser[0],
        sessionToken: 'token',
        isNewUser: true,
      };
    }
  }
}
