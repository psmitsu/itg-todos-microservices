import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

// TODO: ApiResponse Spec
// import { Project } from './project.entity';

@ApiTags('project')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  // @ApiOkResponse({ type: Project, description: 'newly created project' })
  async create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Get()
  // @ApiOkResponse({ isArray: true, type: Project, description: 'found project' })
  async findAll() {
    return this.projectService.findAll();
  }

  // @ApiOkResponse({ type: Project, description: 'found project with lists' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.projectService.findOne(+id);
  }

  @Patch(':id')
  // @ApiOkResponse({ type: Project, description: 'updated project' })
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  // @ApiOkResponse({ type: Project, description: 'deleted projected' })
  async remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }
}
