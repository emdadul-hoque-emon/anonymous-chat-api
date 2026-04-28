import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { RedisModule } from '../redis/redis.module';
import { MessageSubscriber } from './message.subscriber';

@Module({
  imports: [RedisModule],
  providers: [ChatGateway, MessageSubscriber],
})
export class WebsocketModule {}
