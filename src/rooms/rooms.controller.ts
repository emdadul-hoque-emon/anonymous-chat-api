import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomRequest } from './dto/create-room.request';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import type { Request } from 'express';
import { httpExceptions } from '../common/exceptions/http.exceptions';

declare global {
  namespace Express {
    interface Request {
      user: { id: string; username: string; iat: number; exp: number } | null;
    }
  }
}

@UseGuards(JwtAuthGuard)
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  async getRooms(@Req() req: Request) {
    return this.roomsService.getRooms();
  }

  @Post()
  async createRoom(@Body() body: CreateRoomRequest, @Req() req: Request) {
    if (!req.user) throw httpExceptions.UNAUTHORIZED();
    return this.roomsService.createRoom({ ...body, ownerId: req.user.id });
  }

  @Get(':id')
  async getRoom(@Param('id') roomId: string) {
    return this.roomsService.getRoom(roomId);
  }

  @Delete(':id')
  async deleteRoom(@Param('id') roomId: string, @Req() req: Request) {
    if (!req.user) throw httpExceptions.UNAUTHORIZED();
    return this.roomsService.deleteRoom(roomId, req.user.id);
  }
}
