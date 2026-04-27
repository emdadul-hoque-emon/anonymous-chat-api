import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { Server } from 'socket.io';
import { setupRedisAdapter } from './websocket/redis.adapter';
import { MessageSubscriber } from './websocket/message.subscriber';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const server = app.getHttpServer();

  const io = new Server(server, {
    cors: { origin: '*' },
  });

  // Redis Adapter (multi-instance scaling)
  await setupRedisAdapter(io);

  // Redis Subscriber (message broadcast)
  new MessageSubscriber(io);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const firstError = errors[0];
        const firstConstraint = Object.values(firstError.constraints || {})[0];

        return new BadRequestException({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: firstConstraint || 'Validation failed',
          },
        });
      },
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
