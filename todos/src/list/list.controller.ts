import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RpcException, MessagePattern } from '@nestjs/microservices';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { MoveListDto } from './dto/move-list.dto';

import { ListService } from './list.service';
import { List } from './list.entity';

@ApiTags('list')
@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @MessagePattern({ cmd: 'list-create' })
  create({
    authorId,
    createListDto,
  }: {
    authorId: string;
    createListDto: CreateListDto;
  }) {
    return this.listService.create(+authorId, createListDto);
  }

  // @Get(':projectId')
  // findAll(@Param('projectId') projectId: string) {
  //   return this.listService.findAll(+projectId);
  // }

  @MessagePattern({ cmd: 'list-findone' })
  findOne({ authorId, id }: { authorId: string; id: string }) {
    return this.listService.findOne(+authorId, +id);
  }

  @MessagePattern({ cmd: 'list-update' })
  update({
    authorId,
    id,
    updateListDto,
  }: {
    authorId: string;
    id: string;
    updateListDto: UpdateListDto;
  }) {
    return this.listService.update(+authorId, +id, updateListDto);
  }

  @MessagePattern({ cmd: 'list-move' })
  move({
    authorId,
    id,
    moveListDto,
  }: {
    authorId: string;
    id: string;
    moveListDto: MoveListDto;
  }) {
    return this.listService.update(+authorId, +id, moveListDto);
  }

  @MessagePattern({ cmd: 'list-remove' })
  remove({ authorId, id }: { authorId: string; id: string }) {
    return this.listService.remove(+authorId, +id);
  }
}
