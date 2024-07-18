import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { RpcException, MessagePattern } from '@nestjs/microservices';

import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
// import { Project } from './project.entity';

@ApiTags('project')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // @ApiOkResponse({ type: Project, description: 'newly created project' })
  @MessagePattern({ cmd: 'project-create' })
  async create({
    authorId,
    createProjectDto,
  }: {
    authorId: number;
    createProjectDto: CreateProjectDto;
  }) {
    return this.projectService.create(authorId, createProjectDto);
  }
  // create(@Body() createProjectDto: CreateProjectDto) {
  //   return this.projectService.create(createProjectDto);
  // }

  // @ApiOkResponse({ isArray: true, type: Project, description: 'found project' })
  @MessagePattern({ cmd: 'project-findall' })
  async findAll({ authorId }: { authorId: string }) {
    return this.projectService.findAll(+authorId);
  }

  // @ApiOkResponse({ type: Project, description: 'found project with lists' })
  @MessagePattern({ cmd: 'project-findone' })
  async findOne({ authorId, id }: { authorId: string; id: string }) {
    return this.projectService.findOne(+authorId, +id);
  }

  // @ApiOkResponse({ type: Project, description: 'updated project' })
  @MessagePattern({ cmd: 'project-update' })
  async update({
    authorId,
    id,
    updateProjectDto,
  }: {
    authorId: string;
    id: string;
    updateProjectDto: UpdateProjectDto;
  }) {
    return this.projectService.update(+authorId, +id, updateProjectDto);
  }

  // @ApiOkResponse({ type: Project, description: 'deleted projected' })
  @MessagePattern({ cmd: 'project-remove' })
  async remove({ authorId, id }: { authorId: string; id: string }) {
    return this.projectService.remove(+authorId, +id);
  }
}
