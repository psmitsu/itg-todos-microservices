import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CardFieldService } from './card-field.service';
import { CreateCardFieldDto } from './dto/create-card-field.dto';
import { UpdateCardFieldDto } from './dto/update-card-field.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('card-field')
@Controller('card-field')
export class CardFieldController {
  constructor(private readonly cardFieldService: CardFieldService) {}

  @Post()
  create(@Body() createCardFieldDto: CreateCardFieldDto) {
    return this.cardFieldService.create(createCardFieldDto);
  }

  @Get()
  findAll() {
    return this.cardFieldService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardFieldService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCardFieldDto: UpdateCardFieldDto,
  ) {
    return this.cardFieldService.update(+id, updateCardFieldDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardFieldService.remove(+id);
  }
}
