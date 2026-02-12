import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from './common/filters/prisma-client-exception.filter';

export function setupApp(app: INestApplication) {
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: process.env.WEB_URL ?? 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new PrismaExceptionFilter());
}
