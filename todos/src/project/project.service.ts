import { Injectable, Inject, Scope, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './project.entity';
import { RpcException } from '@nestjs/microservices';

@Injectable({ scope: Scope.REQUEST })
export class ProjectService {
  constructor(
    @InjectRepository(Project) private projectsRepository: Repository<Project>,
    @Inject(REQUEST) private request: Request,
  ) {}

  async create(authorId: number, createProjectDto: CreateProjectDto) {
    let project = new Project();

    project = {
      ...project,
      ...createProjectDto,
      authorId,
      createdAt: new Date(),
    };

    return this.projectsRepository.save(project);
  }

  async findAll(authorId: number) {
    const results = await this.projectsRepository.find({
      where: {
        authorId,
      },
    });

    return results;
  }

  async findOne(authorId: number, id: number, withRelations = true) {
    console.log('project findOne');
    const project = await this.projectsRepository.findOneOrFail({
      relations: {
        lists: withRelations && {
          cards: {
            stringFields: { field: true },
            enumFields: { value: { field: true } },
          },
        },
        fields: withRelations && {
          enumValues: true,
        },
      },
      where: { id },
    });

    await this.checkAuthor(authorId, project);

    return project;
  }

  async update(
    authorId: number,
    id: number,
    updateProjectDto: UpdateProjectDto,
  ) {
    let project = await this.findOne(authorId, id);

    project = {
      ...project,
      ...updateProjectDto,
    };

    return this.projectsRepository.save(project);
  }

  async remove(authorId: number, id: number) {
    const project = await this.findOne(authorId, id);
    return this.projectsRepository.remove(project);
  }

  // TODO: Promise<void>
  async checkAuthor(authorId: number, project: Project) {
    console.log('checkAuthor, project:');
    console.log(project);
    console.log('checkAuthor, authorId:');
    console.log(authorId);

    if (project.authorId !== authorId) {
      throw new RpcException('Unauthorized');
    }
  }
}
