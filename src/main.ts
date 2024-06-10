import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';

async function start() {
  const PORT = process.env.PORT || 5555;

  const app = await NestFactory.create(AppModule);

  app.enableCors();

  await app.listen(PORT, () => console.log(`Server started on ${PORT}`));
}

start();
