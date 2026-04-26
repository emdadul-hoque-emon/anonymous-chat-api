import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomRequest } from './dto/create-room.request';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}
  @Get()
  async getRooms() {
    return this.roomsService.getRooms();
  }

  @Get(':id')
  async getRoom(@Param('id') roomId: string) {
    return this.roomsService.getRoom(roomId);
  }

  @Post()
  async createRoom(@Body() body: CreateRoomRequest) {
    return this.roomsService.createRoom(body);
  }
}
