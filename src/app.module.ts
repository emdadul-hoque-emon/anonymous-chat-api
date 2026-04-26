import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, UsersModule, AuthModule, RoomsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
