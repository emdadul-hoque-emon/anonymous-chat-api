import Redis from 'ioredis';

export class RedisService {
  public client: Redis;
  public pub: Redis;
  public sub: Redis;

  constructor() {
    const url = process.env.REDIS_URL!;

    this.client = new Redis(url);
    this.pub = new Redis(url);
    this.sub = new Redis(url);
  }

  // =========================
  // SESSION STORAGE
  // =========================

  async setSession(token: string, user: any) {
    await this.client.set(
      `session:${token}`,
      JSON.stringify(user),
      'EX',
      60 * 60 * 24, // 24h
    );
  }

  async getSession(token: string) {
    const data = await this.client.get(`session:${token}`);
    return data ? JSON.parse(data) : null;
  }

  // =========================
  // ROOM USERS (ACTIVE USERS)
  // =========================

  async addUser(roomId: string, username: string) {
    await this.client.sadd(`room:${roomId}:users`, username);
  }

  async removeUser(roomId: string, username: string) {
    await this.client.srem(`room:${roomId}:users`, username);
  }

  async getUsers(roomId: string) {
    return await this.client.smembers(`room:${roomId}:users`);
  }

  async getUserCount(roomId: string) {
    return await this.client.scard(`room:${roomId}:users`);
  }
}
