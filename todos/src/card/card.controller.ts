import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MessagePattern } from '@nestjs/microservices';

import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { MoveCardDto } from './dto/move-card.dto';

import { CardService } from './card.service';
import { Card } from './card.entity';

@ApiTags('card')
@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @MessagePattern({ cmd: 'card-create' })
  create({
    authorId,
    createCardDto,
  }: {
    authorId: string;
    createCardDto: CreateCardDto;
  }) {
    return this.cardService.create(+authorId, createCardDto);
  }

  // @Get()
  // findAll() {
  //   return this.cardService.findAll();
  // }

  @MessagePattern({ cmd: 'card-findone' })
  findOne({ authorId, id }: { authorId: string; id: string }) {
    return this.cardService.findOne(+authorId, +id);
  }

  @MessagePattern({ cmd: 'card-update' })
  update({
    authorId,
    id,
    updateCardDto,
  }: {
    authorId: string;
    id: string;
    updateCardDto: UpdateCardDto;
  }) {
    return this.cardService.update(+authorId, +id, updateCardDto);
  }

  @MessagePattern({ cmd: 'card-move' })
  move({
    authorId,
    id,
    moveCardDto,
  }: {
    authorId: string;
    id: string;
    moveCardDto: MoveCardDto;
  }) {
    return this.cardService.update(+authorId, +id, moveCardDto);
  }

  @MessagePattern({ cmd: 'card-remove' })
  remove({ authorId, id }: { authorId: string; id: string }) {
    return this.cardService.remove(+authorId, +id);
  }
}
