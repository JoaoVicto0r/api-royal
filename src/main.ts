import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { BigIntSerializerInterceptor } from './common/interceptors/bigint-serializer.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  app.use(cookieParser());
  app.useGlobalInterceptors(new BigIntSerializerInterceptor());

  // Pipes globais para DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove campos não declarados nos DTOs
      forbidNonWhitelisted: true, // lança erro se vier campo não esperado
      transform: true, // converte string -> number (quando tem @Type(() => Number))
      transformOptions: {
        enableImplicitConversion: true, // opcional: tenta converter automaticamente sem precisar sempre de @Type()
      },
    }),
  );

  // await app.listen(process.env.PORT || 3001, '::');
  await app.listen(process.env.PORT || 3001, '0.0.0.0');
}
bootstrap();
