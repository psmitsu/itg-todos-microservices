import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
// import { Card } from './card.entity';
import { MoveCardDto } from './dto/move-card.dto';

@ApiTags('card')
@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  // @ApiOkResponse({ description: 'newly created card', type: Card })
  create(@Body() createCardDto: CreateCardDto) {
    return this.cardService.create(createCardDto);
  }

  // @Get()
  // findAll() {
  //   return this.cardService.findAll();
  // }

  @Get(':id')
  // @ApiOkResponse({ description: 'found card', type: Card })
  findOne(@Param('id') id: string) {
    return this.cardService.findOne(+id);
  }

  @Patch(':id')
  // @ApiOkResponse({ description: 'updated card', type: Card })
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardService.update(+id, updateCardDto);
  }

  @Patch(':id/move')
  // @ApiOkResponse({ description: 'card with updated position', type: Card })
  move(@Param('id') id: string, @Body() moveCardDto: MoveCardDto) {
    return this.cardService.update(+id, moveCardDto);
  }

  @Delete(':id')
  // @ApiOkResponse({ description: 'deleted card', type: Card })
  remove(@Param('id') id: string) {
    return this.cardService.remove(+id);
  }
}
