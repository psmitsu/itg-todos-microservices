import { Injectable, Inject, Scope, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable({ scope: Scope.REQUEST })
export class ProjectService {
  constructor(
    @Inject('TODOS_SERVICE') private todosClient: ClientProxy,
    @Inject(REQUEST) private request: Request,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    const { id: authorId } = this.request['user'];
    return this.todosClient.send(
      { cmd: 'project-create' },
      { authorId, createProjectDto },
    );
  }

  async findAll() {
    const { id: authorId } = this.request['user'];
    return this.todosClient.send({ cmd: 'project-findall' }, { authorId });
  }

  async findOne(id: number) {
    const { id: authorId } = this.request['user'];
    return this.todosClient.send({ cmd: 'project-findone' }, { authorId, id });
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const { id: authorId } = this.request['user'];
    return this.todosClient.send(
      { cmd: 'project-update' },
      { authorId, id, updateProjectDto },
    );
  }

  async remove(id: number) {
    const { id: authorId } = this.request['user'];
    return this.todosClient.send({ cmd: 'project-remove' }, { authorId, id });
  }
}
