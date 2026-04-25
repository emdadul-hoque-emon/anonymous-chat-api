import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
