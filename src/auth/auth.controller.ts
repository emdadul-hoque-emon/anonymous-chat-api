import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../users/dto/create-user.request';
import type { Response } from 'express';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const { isNewUser, ...result } = await this.authService.login(body);

    if (isNewUser) {
      return res.status(201).json(result);
    }

    return res.status(200).json(result);
  }
}
