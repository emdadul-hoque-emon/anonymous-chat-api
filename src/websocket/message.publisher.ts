import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class MessagePublisher {
  constructor(private redis: RedisService) {}

  async publishMessage(roomId: string, message: any) {
    await this.redis.pub.publish(
      `room:${roomId}:messages`,
      JSON.stringify(message),
    );
  }
}
