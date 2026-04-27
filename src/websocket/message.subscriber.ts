import Redis from 'ioredis';
import { Server } from 'socket.io';

export class MessageSubscriber {
  private sub: Redis;

  constructor(private io: Server) {
    this.sub = new Redis(process.env.REDIS_URL!);

    this.sub.psubscribe('room:*:messages');

    this.sub.on('pmessage', (_pattern, channel, message) => {
      const roomId = channel.split(':')[1];

      const parsed = JSON.parse(message);

      this.io.to(roomId).emit('message:new', parsed);
    });
  }
}
