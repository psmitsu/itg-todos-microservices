import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { CardFieldService } from './card-field.service';

import { CreateCardFieldDto } from './dto/create-card-field.dto';
import { UpdateCardFieldDto } from './dto/update-card-field.dto';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('card-field')
@Controller('card-field')
export class CardFieldController {
  constructor(private readonly cardFieldService: CardFieldService) {}

  @MessagePattern({ cmd: 'card-field-create' })
  create({
    authorId,
    createCardFieldDto,
  }: {
    authorId: string;
    createCardFieldDto: CreateCardFieldDto;
  }) {
    return this.cardFieldService.create(+authorId, createCardFieldDto);
  }

  @MessagePattern({ cmd: 'card-field-findall' })
  findAll({ authorId }: { authorId: string }) {
    return this.cardFieldService.findAll(+authorId);
  }

  @MessagePattern({ cmd: 'card-field-findone' })
  findOne({ authorId, id }: { authorId: string; id: string }) {
    return this.cardFieldService.findOne(+authorId, +id);
  }

  @MessagePattern({ cmd: 'card-field-update' })
  update({
    authorId,
    id,
    updateCardFieldDto,
  }: {
    authorId: string;
    id: string;
    updateCardFieldDto: UpdateCardFieldDto;
  }) {
    return this.cardFieldService.update(+authorId, +id, updateCardFieldDto);
  }

  @MessagePattern({ cmd: 'card-field-delete' })
  remove({ authorId, id }: { authorId: string; id: string }) {
    return this.cardFieldService.remove(+authorId, +id);
  }
}
