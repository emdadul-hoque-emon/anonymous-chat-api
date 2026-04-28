import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { RedisService } from '../redis/redis.service';

@WebSocketGateway({
  namespace: '/chat',
  cors: { origin: '*' },
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  constructor(private redis: RedisService) {}

  afterInit() {
    console.log('🚀 Chat Gateway Initialized');
  }

  async handleConnection(socket: Socket) {
    const { token, roomId } = socket.handshake.query as any;

    const session = await this.redis.getSession(token);

    if (!session) {
      socket.disconnect();
      return;
    }

    if (!roomId) {
      socket.disconnect();
      return;
    }

    socket.join(roomId);

    await this.redis.addUser(roomId, session.username);

    const users = await this.redis.getUsers(roomId);

    socket.emit('room:joined', { activeUsers: users });

    socket.to(roomId).emit('room:user_joined', {
      username: session.username,
      activeUsers: users,
    });
  }

  async handleDisconnect(socket: Socket) {
    const { token, roomId } = socket.handshake.query as any;

    const session = await this.redis.getSession(token);
    if (!session || !roomId) return;

    await this.redis.removeUser(roomId, session.username);

    const users = await this.redis.getUsers(roomId);

    this.server.to(roomId).emit('room:user_left', {
      username: session.username,
      activeUsers: users,
    });
  }
}
