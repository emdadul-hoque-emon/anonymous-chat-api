import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../database/constant';
import * as schema from '../users/schema';
import { eq } from 'drizzle-orm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
    private readonly jwtService: JwtService,
  ) {}

  async login(payload: typeof schema.users.$inferInsert) {
    const user = await this.database.query.users.findFirst({
      where: (user) => eq(user.username, payload.username),
    });

    if (user) {
      return {
        sessionToken: this.jwtService.sign({
          id: user.id,
          username: user.username,
        }),
        user,
        isNewUser: false,
      };
    } else {
      const newUser = await this.database
        .insert(schema.users)
        .values(payload)
        .returning();
      return {
        sessionToken: this.jwtService.sign({
          id: newUser[0].id,
          username: newUser[0].username,
        }),
        user: newUser[0],
        isNewUser: true,
      };
    }
  }
}
