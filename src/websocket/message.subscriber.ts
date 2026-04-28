import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class MessageSubscriber implements OnModuleInit {
  constructor(
    private redis: RedisService,
    private gateway: ChatGateway,
  ) {}

  onModuleInit() {
    this.redis.sub.subscribe('room:*:messages');

    this.redis.sub.on('message', (channel, msg) => {
      console.log(channel);
      const roomId = channel.split(':')[1];
      const message = JSON.parse(msg);

      this.gateway.server.to(roomId).emit('message:new', message);
    });
  }
}
