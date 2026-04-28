import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../database/constant';
import * as schema from '../users/schema';
import { eq } from 'drizzle-orm';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
    private readonly jwtService: JwtService,
    private readonly redis: RedisService,
  ) {}

  async login(payload: typeof schema.users.$inferInsert) {
    const user = await this.database.query.users.findFirst({
      where: (user) => eq(user.username, payload.username),
    });

    if (user) {
      const sessionToken = this.jwtService.sign({
        id: user.id,
        username: user.username,
      });
      await this.redis.setSession(sessionToken, {
        id: user.id,
        username: user.username,
      });
      return {
        sessionToken,
        user,
        isNewUser: false,
      };
    } else {
      const [newUser] = await this.database
        .insert(schema.users)
        .values(payload)
        .returning();

      const sessionToken = this.jwtService.sign({
        id: newUser.id,
        username: newUser.username,
      });
      await this.redis.setSession(sessionToken, {
        id: newUser.id,
        username: newUser.username,
      });

      return {
        sessionToken,
        user: newUser,
        isNewUser: true,
      };
    }
  }
}
