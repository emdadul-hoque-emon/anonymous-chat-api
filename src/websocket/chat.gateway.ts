import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { RedisService } from '../redis/redis.service';

@WebSocketGateway({
  namespace: '/chat',
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private redis: RedisService) {}

  // =========================
  // CONNECTION HANDLER
  // =========================

  async handleConnection(socket: Socket) {
    const { token, roomId } = socket.handshake.query as any;

    // 1. Validate session
    const session = await this.redis.getSession(token);

    if (!session) {
      socket.emit('connect_error', { code: 401 });
      socket.disconnect();
      return;
    }

    // 2. Validate room existence (replace with DB check)
    const roomExists = await this.validateRoom(roomId);

    if (!roomExists) {
      socket.emit('connect_error', { code: 404 });
      socket.disconnect();
      return;
    }

    socket.join(roomId);

    // 3. Add user to Redis
    await this.redis.addUser(roomId, session.username);

    const users = await this.redis.getUsers(roomId);

    // 4. Send to self
    socket.emit('room:joined', {
      activeUsers: users,
    });

    // 5. Broadcast join
    socket.to(roomId).emit('room:user_joined', {
      username: session.username,
      activeUsers: users,
    });
  }

  // =========================
  // DISCONNECT HANDLER
  // =========================

  async handleDisconnect(socket: Socket) {
    const { token, roomId } = socket.handshake.query as any;

    const session = await this.redis.getSession(token);
    if (!session) return;

    await this.redis.removeUser(roomId, session.username);

    const users = await this.redis.getUsers(roomId);

    this.server.to(roomId).emit('room:user_left', {
      username: session.username,
      activeUsers: users,
    });
  }

  // =========================
  // MOCK ROOM CHECK (replace with DB)
  // =========================

  async validateRoom(roomId: string) {
    return roomId && roomId.startsWith('room_');
  }
}
