import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { Reflector } from '@nestjs/core';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  // app.use(cookieParser());

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  await app.listen(PORT);
  console.log(`Application is running on: http://localhost:${PORT}`);
}
bootstrap();
