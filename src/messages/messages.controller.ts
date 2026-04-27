import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { CreateMessageRequest } from './dto/create-message.request';
import type { Request } from 'express';
import { httpExceptions } from '../common/exceptions/http.exceptions';

@UseGuards(JwtAuthGuard)
@Controller('rooms/:roomId/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async getMessages(@Param('roomId') roomId: string) {
    return await this.messagesService.getMessages(roomId);
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
