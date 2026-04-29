import { Body, Controller, Post, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../users/dto/create-user.request';
import type { Response } from 'express';

@Controller({
  path: '',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { isNewUser, ...result } = await this.authService.login(body);

    res.status(isNewUser ? HttpStatus.CREATED : HttpStatus.OK);

    return result;
  }
}
