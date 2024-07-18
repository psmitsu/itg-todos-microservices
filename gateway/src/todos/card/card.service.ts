import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

// import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
// import { DataSource, Repository } from 'typeorm';

import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

// import { ListService } from 'src/list/list.service';
// import { Card } from './card.entity';
// import { ProjectService } from 'src/project/project.service';
// import { PositionBadRangeError } from 'src/position-bad-range.error';
// import { CardFieldStringValue } from 'src/card-field-value/card-field-string-value.entity';
// import { CardFieldService } from 'src/card-field/card-field.service';
// import { CardFieldValueService } from 'src/card-field-value/card-field-value.service';
// import { List } from 'src/list/list.entity';

@Injectable()
export class CardService {
  constructor(
    @Inject('TODOS_SERVICE') private todosClient: ClientProxy,
    @Inject(REQUEST) private request: Request,
  ) {}

  async create(createCardDto: CreateCardDto) {
    const { id: authorId } = this.request['user'];
    return this.todosClient.send(
      { cmd: 'card-create' },
      { authorId, createCardDto },
    );
  }

  async findOne(id: number) {
    const { id: authorId } = this.request['user'];
    return this.todosClient.send({ cmd: 'card-findone' }, { authorId, id });
  }

  async update(id: number, updateCardDto: UpdateCardDto) {
    const { id: authorId } = this.request['user'];
    return this.todosClient.send(
      { cmd: 'card-update' },
      { authorId, id, updateCardDto },
    );
  }

  async remove(id: number) {
    const { id: authorId } = this.request['user'];
    return this.todosClient.send({ cmd: 'card-remove' }, { authorId, id });
  }
}
