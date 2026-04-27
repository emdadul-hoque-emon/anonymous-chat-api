import { createAdapter } from '@socket.io/redis-adapter';
import { Server } from 'socket.io';
import Redis from 'ioredis';

export const setupRedisAdapter = async (io: Server) => {
  const pubClient = new Redis(process.env.REDIS_URL!);
  const subClient = pubClient.duplicate();

  // await Promise.all([pubClient.connect?.(), subClient.connect?.()]);

  io.adapter(createAdapter(pubClient, subClient));
};
