import { Injectable, Inject, Scope, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

import { CreateCardFieldDto } from './dto/create-card-field.dto';
import { UpdateCardFieldDto } from './dto/update-card-field.dto';

// import { BadRequestException, Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { CardField, FieldType } from './card-field.entity';
// import { Repository } from 'typeorm';
// import { ProjectService } from 'src/project/project.service';
// import { Project } from 'src/project/project.entity';
// import { EnumValue } from './enum-value.entity';

@Injectable()
export class CardFieldService {
  constructor(
    @Inject('TODOS_SERVICE') private todosClient: ClientProxy,
    @Inject(REQUEST) private request: Request,
  ) {}

  async create(createCardFieldDto: CreateCardFieldDto) {
    const { id: authorId } = this.request['user'];
    return this.todosClient.send(
      { cmd: 'card-field-create' },
      { authorId, createCardFieldDto },
    );
  }

  // TODO: update card field (name, enum values set)
  update(id: number, updateCardFieldDto: UpdateCardFieldDto) {
    return `This action updates a #${id} cardField`;
  }

  // this is handled by Project already
  findAll() {
    return `This action returns all cardField`;
  }

  async findOne(id: number) {
    const { id: authorId } = this.request['user'];
    return this.todosClient.send(
      { cmd: 'card-field-findone' },
      { authorId, id },
    );
  }

  // TODO: remove card field
  remove(id: number) {
    return `This action removes a #${id} cardField`;
  }
}
