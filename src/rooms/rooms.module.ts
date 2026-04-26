import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { DatabaseModule } from '../database/database.module';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from '../auth/config/jwt.config';

@Module({
  imports: [DatabaseModule, JwtModule.registerAsync(jwtConfig.asProvider())],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
