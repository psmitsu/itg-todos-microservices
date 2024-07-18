import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log(`amqp://${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`);
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`],
        queue: process.env.AUTH_QUEUE,
        queueOptions: { durable: false },
      },
    },
  );
  await app.listen();
}

bootstrap();
