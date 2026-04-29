import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { CreateMessageRequest } from './dto/create-message.request';
import type { Request } from 'express';
import { httpExceptions } from '../common/exceptions/http.exceptions';

@UseGuards(JwtAuthGuard)
@Controller({
  path: 'rooms/:roomId/messages',
  version: '1',
})
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async getMessages(
    @Param('roomId') roomId: string,
    @Query('before') before?: string,
    @Query('limit') limit?: number,
  ) {
    return await this.messagesService.getMessages(roomId, limit, before);
  }

  @Post()
  async createMessage(
    @Body() body: CreateMessageRequest,
    @Param('roomId') roomId: string,
    @Req() req: Request,
  ) {
    if (!req.user) throw httpExceptions.UNAUTHORIZED();
    body.content = body.content.trim();
    return await this.messagesService.createMessage({
      ...body,
      userId: req.user.id,
      roomId,
    });
  }
}
