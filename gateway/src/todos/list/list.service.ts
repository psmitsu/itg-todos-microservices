import { Injectable, Inject, Scope, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

// import { ProjectService } from 'src/project/project.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
// import { List } from './list.entity';
// import { PositionBadRangeError } from 'src/position-bad-range.error';
// import { Project } from 'src/project/project.entity';

@Injectable({ scope: Scope.REQUEST })
export class ListService {
  constructor(
    @Inject('TODOS_SERVICE') private todosClient: ClientProxy,
    @Inject(REQUEST) private request: Request,
  ) {}

  async create(createListDto: CreateListDto) {
    const { id: authorId } = this.request['user'];
    return this.todosClient.send(
      { cmd: 'list-create' },
      { authorId, createListDto },
    );
  }

  async findOne(id: number) {
    const { id: authorId } = this.request['user'];
    return this.todosClient.send({ cmd: 'list-findone' }, { authorId, id });
  }

  async update(id: number, updateListDto: UpdateListDto) {
    const { id: authorId } = this.request['user'];
    return this.todosClient.send(
      { cmd: 'list-update' },
      { authorId, id, updateListDto },
    );
  }

  async remove(id: number) {
    const { id: authorId } = this.request['user'];
    return this.todosClient.send({ cmd: 'list-remove' }, { authorId, id });
  }
}
