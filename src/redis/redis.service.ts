import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  public client = new Redis(process.env.REDIS_URL!);
  public sub = this.client.duplicate();
  public pub = this.client.duplicate();

  // sessions
  async setSession(token: string, data: any) {
    await this.client.set(
      `session:${token}`,
      JSON.stringify(data),
      'EX',
      60 * 60 * 24,
    );
  }

  async getSession(token: string) {
    const data = await this.client.get(`session:${token}`);
    return data ? JSON.parse(data) : null;
  }

  // room users
  async addUser(roomId: string, username: string) {
    await this.client.sadd(`room:${roomId}:users`, username);
  }

  async removeUser(roomId: string, username: string) {
    await this.client.srem(`room:${roomId}:users`, username);
  }

  async getUsers(roomId: string) {
    return this.client.smembers(`room:${roomId}:users`);
  }

  async getUserCount(roomId: string) {
    return this.client.scard(`room:${roomId}:users`);
  }
}
