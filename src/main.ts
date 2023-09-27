import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function start() {
  const PORT = process.env.PORT || 5000;
  const app = NestFactory.create(AppModule);

  (await app).listen(PORT, () => console.log(`Server started on port ${PORT}`));
  (await app).setGlobalPrefix('api');
  (await app).enableCors
}
start();
