import {
  Injectable,
  Inject,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
// import { REQUEST } from '@nestjs/core';
// import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProjectService } from 'src/project/project.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { List } from './list.entity';
import { MoveListDto } from './dto/move-list.dto';
// import { PositionBadRangeError } from 'src/position-bad-range.error';
import { Project } from 'src/project/project.entity';
import { RpcException } from '@nestjs/microservices';

//@Injectable({ scope: Scope.REQUEST })
@Injectable()
export class ListService {
  constructor(
    private projectService: ProjectService,
    @InjectRepository(List) private listRepository: Repository<List>,
  ) {}

  async getMaxPosition(): Promise<number> {
    const res = await this.listRepository
      .createQueryBuilder('list')
      .select('MAX(list.position)', 'max')
      .getRawOne();

    if (res.max !== null) {
      return res.max;
    }

    return -1;
  }

  async create(authorId: number, createListDto: CreateListDto) {
    // will throw UnauthorizedException if project inaccessible for the user
    const project = await this.projectService.findOne(
      authorId,
      createListDto.projectId,
      false,
    );
    delete createListDto.projectId;

    const maxPosition = await this.getMaxPositionWithinProject(project);

    let list = new List();
    list = {
      ...list,
      ...createListDto,
      project,
      position: maxPosition + 1,
      createdAt: new Date(),
    };

    return this.listRepository.save(list);
  }

  async findOne(authorId: number, id: number, withCards = true) {
    const list = await this.listRepository.findOneOrFail({
      relations: {
        project: true,
        cards: withCards,
      },
      where: { id },
    });

    this.projectService.checkAuthor(authorId, list.project);

    return list;
  }

  async update(authorId: number, id: number, updateListDto: UpdateListDto) {
    let list = await this.findOne(authorId, id, false);

    if (
      updateListDto.projectId !== undefined &&
      updateListDto.projectId !== list.project.id
    ) {
      console.log('project');
      const project = await this.projectService.findOne(
        authorId,
        updateListDto.projectId,
        false,
      );
      delete updateListDto.projectId;
      list = { ...list, project };
    }

    // TODO: this has to be in transaction
    if (updateListDto.position !== undefined) {
      await this.checkPositionUpdateAll(list, updateListDto.position);
    }

    list = { ...list, ...updateListDto };
    return this.listRepository.save(list);
  }

  async remove(authorId: number, id: number) {
    // will throw if unauthorized
    const list = await this.findOne(authorId, id, false);

    // fix positions
    await this.listRepository
      .createQueryBuilder()
      .update(List)
      .set({
        position: () => 'position - 1',
      })
      .where('projectId = :projectId AND position > :removedPosition', {
        projectId: list.project.id,
        removedPosition: list.position,
      })
      .execute();

    return this.listRepository.remove(list);
  }

  private async checkPositionUpdateAll(list: List, newPosition: number) {
    const { position: oldPosition } = list;
    if (newPosition < 0) {
      // throw new PositionBadRangeError();
      throw new RpcException('Wrong Position Value');
    }

    const maxPosition = await this.getMaxPositionWithinProject(list.project);

    console.log('maxPos', maxPosition);

    if (newPosition > maxPosition) {
      // throw new PositionBadRangeError();
      throw new RpcException('Wrong Position Value');
    }

    console.log('newPos', newPosition, 'oldPos', oldPosition);

    // right: move all with (position <= newPosition and position > oldPosition) to position-1
    // left: move all with (position >= newPosition and position < oldPosition) to position+1
    let whereClause = 'projectId = :projectId';
    whereClause += ` AND position ${newPosition > oldPosition ? '<=' : '>='} :newPosition`;
    whereClause += ` AND position ${newPosition > oldPosition ? '>' : '<'} :oldPosition`;
    const setClause = `position ${newPosition > oldPosition ? '-' : '+'} 1`;

    console.log('where', whereClause);
    console.log('set', setClause);

    return await this.listRepository
      .createQueryBuilder()
      .update(List)
      .set({
        position: () => setClause,
      })
      .where(whereClause, {
        projectId: list.project.id,
        newPosition,
        oldPosition,
      })
      .execute();
  }

  private async getMaxPositionWithinProject(project: Project): Promise<number> {
    const res = await this.listRepository
      .createQueryBuilder('list')
      .select('MAX(list.position)', 'max')
      .where('list.projectId = :projectId', { projectId: project.id })
      .getRawOne();

    if (res.max !== null) {
      return res.max;
    }

    return -1;
  }
}
