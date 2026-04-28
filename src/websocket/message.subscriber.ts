import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class MessageSubscriber implements OnModuleInit {
  constructor(
    private redis: RedisService,
    private gateway: ChatGateway,
  ) {}

  async onModuleInit() {
    await this.redis.sub.psubscribe('room:*:messages');

    // ✅ MUST use pmessage
    this.redis.sub.on('pmessage', (pattern, channel, msg) => {
      const roomId = channel.split(':')[1];
      const message = JSON.parse(msg);

      this.gateway.server.to(roomId).emit('message:new', message);
    });
  }
}
