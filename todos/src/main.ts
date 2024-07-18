import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { ErrorsInterceptor } from './errors.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  console.log(`amqp://${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`);
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`],
        queue: process.env.TODOS_QUEUE,
        queueOptions: { durable: false },
      },
    },
  );

  app.useGlobalInterceptors(new ErrorsInterceptor());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen();
}

bootstrap();
