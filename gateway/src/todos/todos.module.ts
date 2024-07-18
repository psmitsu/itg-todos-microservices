import { Module } from '@nestjs/common';

import { ProjectController } from './project/project.controller';
import { ProjectService } from './project/project.service';

import { ListController } from './list/list.controller';
import { ListService } from './list/list.service';

import { CardController } from './card/card.controller';
import { CardService } from './card/card.service';

import { CardFieldController } from './card-field/card-field.controller';
import { CardFieldService } from './card-field/card-field.service';

import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TODOS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`],
          queue: process.env.TODOS_QUEUE,
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  controllers: [
    ProjectController,
    ListController,
    CardController,
    CardFieldController,
  ],
  providers: [ProjectService, ListService, CardService, CardFieldService],
})
export class TodosModule {}
