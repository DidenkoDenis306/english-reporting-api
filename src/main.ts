import { NestFactory } from '@nestjs/core';
import * as process from 'process';
import { AppModule } from './app.module';

async function start() {
  const PORT = 7654;

  const app = await NestFactory.create(AppModule);

  app.enableCors();

  await app.listen(PORT, () => console.log(`Server started on ${PORT}`));
}

start();
