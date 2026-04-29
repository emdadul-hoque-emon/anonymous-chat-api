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
    await this.redis.sub.psubscribe('room:*');

    this.redis.sub.on('pmessage', (pattern, channel, msg) => {
      const [, roomId, type] = channel.split(':');

      if (type === 'messages') {
        const message = JSON.parse(msg);
        this.gateway.server.to(roomId).emit('message:new', message);
      }

      if (type === 'delete') {
        this.gateway.server.to(roomId).emit('room:deleted', {
          roomId,
        });
      }
    });
  }
}
