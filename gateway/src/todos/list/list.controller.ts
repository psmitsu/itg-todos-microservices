import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MoveListDto } from './dto/move-list.dto';
// import { List } from './list.entity';

@ApiTags('list')
@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  // @ApiOkResponse({ description: 'newly created list', type: List })
  create(@Body() createListDto: CreateListDto) {
    return this.listService.create(createListDto);
  }

  // @Get(':projectId')
  // findAll(@Param('projectId') projectId: string) {
  //   return this.listService.findAll(+projectId);
  // }

  @Get(':id')
  // @ApiOkResponse({ description: 'found list', type: List })
  findOne(@Param('id') id: string) {
    return this.listService.findOne(+id);
  }

  @Patch(':id')
  // @ApiOkResponse({ description: 'a modified list', type: List })
  update(@Param('id') id: string, @Body() updateListDto: UpdateListDto) {
    return this.listService.update(+id, updateListDto);
  }

  @Patch(':id/move')
  // @ApiOkResponse({ description: 'a list with modified position', type: List })
  move(@Param('id') id: string, @Body() moveListDto: MoveListDto) {
    return this.listService.update(+id, moveListDto);
  }

  @Delete(':id')
  // @ApiOkResponse({ description: 'deleted list', type: List })
  remove(@Param('id') id: string) {
    return this.listService.remove(+id);
  }
}
