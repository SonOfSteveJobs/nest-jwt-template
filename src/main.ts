import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function start() {
  const PORT = process.env.PORT || 5000;
  const app = NestFactory.create(AppModule);

  (await app).useGlobalPipes(new ValidationPipe());
  (await app).setGlobalPrefix('api');
  (await app).enableCors;

  (await app).listen(PORT, () => console.log(`Server started on port ${PORT}`));

}
start();
