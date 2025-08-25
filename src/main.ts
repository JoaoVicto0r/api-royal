import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { BigIntSerializerInterceptor } from './common/interceptors/bigint-serializer.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ 
    origin: 'https://crm-gamma-red.vercel.app', 
    credentials: true, 
  });

  app.use(cookieParser());
  app.useGlobalInterceptors(new BigIntSerializerInterceptor());

  await app.listen(3001);
}
bootstrap();
