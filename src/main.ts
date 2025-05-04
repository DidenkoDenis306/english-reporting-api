import { NestFactory } from '@nestjs/core';
import * as process from 'process';
import { AppModule } from './app.module';

async function start() {
  const PORT = process.env.PORT || 7654;

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://english-reporting.com',
      'https://english-reporting.com',
      'https://english-reporting-client.vercel.app',
    ],
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  await app.listen(PORT, () => console.log(`Server started on ${PORT}`));
}

start();
