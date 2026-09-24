// Force IPv4 DNS resolution — required for Windows + Aiven PostgreSQL compatibility
import { setDefaultResultOrder } from 'dns';
setDefaultResultOrder('ipv4first');

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.use(cookieParser());

  // M-2: Tell Express to trust one level of proxy (Render sets X-Forwarded-For reliably).
  // This makes req.ip return the real client IP, which ThrottlerGuard uses for rate-limiting.
  // Without this, all requests appear to come from the Render proxy IP and rate limits are shared.
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  // L-6: Global exception filter — sanitizes error responses in production
  app.useGlobalFilters(new AllExceptionsFilter());

  // Increase payload limit for base64 resumes (H-4: DTO caps actual size at 1.4MB)
  const express = require('express');
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || [
      'http://localhost:8080',
      'http://localhost:5173',
      'https://infynuxacademy.in',
      'https://www.infynuxacademy.in',
    ],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // M-4: Swagger UI exposed ONLY in non-production environments.
  // In production it is completely disabled — no schema leak, no recon surface.
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Infynux Academy API')
      .setDescription('The Infynux Academy backend API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    logger.warn('Swagger UI is ENABLED — development mode only. Disabled in production.');
  }

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  logger.log(`Application running on port ${port} [NODE_ENV=${process.env.NODE_ENV ?? 'development'}]`);
}
bootstrap();
