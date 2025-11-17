import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Cast as any to keep TypeScript happy with helmet’s typing
  app.use(helmet() as any);

  app.enableCors({
    origin: 'http://localhost:3000', // your future Next.js frontend
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
