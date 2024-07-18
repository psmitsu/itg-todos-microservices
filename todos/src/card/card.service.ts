import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

import { ProjectService } from 'src/project/project.service';
import { ListService } from 'src/list/list.service';
import { CardFieldService } from 'src/card-field/card-field.service';
import { CardFieldValueService } from 'src/card-field-value/card-field-value.service';

import { Card } from './card.entity';
import { List } from 'src/list/list.entity';
import { CardFieldStringValue } from 'src/card-field-value/card-field-string-value.entity';
import { RpcException } from '@nestjs/microservices';

// import { PositionBadRangeError } from 'src/position-bad-range.error';

@Injectable()
export class CardService {
  constructor(
    private fieldValueService: CardFieldValueService,
    private fieldService: CardFieldService,
    private listService: ListService,
    private projectService: ProjectService,
    @InjectRepository(Card) private cardRepository: Repository<Card>,
    private dataSource: DataSource,
  ) {}

  async create(authorId: number, createCardDto: CreateCardDto) {
    const list = await this.listService.findOne(
      authorId,
      createCardDto.listId,
      false,
    );

    const card = new Card();

    card.name = createCardDto.name;
    createCardDto.description && (card.description = createCardDto.description);
    card.list = list;
    card.createdAt = new Date();

    // TODO: this should be in transaction
    const maxPosition = await this.getMaxPositionWithinList(list);
    card.position = maxPosition + 1;

    console.log('saving card:', card);
    await this.cardRepository.save(card);

    if (createCardDto.stringFields !== undefined) {
      card.stringFields = await this.fieldValueService.saveStringValues(
        authorId,
        createCardDto.stringFields,
        card,
      );
    }

    if (createCardDto.enumFields !== undefined) {
      card.enumFields = await this.fieldValueService.saveEnumValues(
        createCardDto.enumFields,
        card,
      );
    }

    return card;
  }

  async findOne(authorId: number, id: number) {
    const card = await this.cardRepository.findOneOrFail({
      relations: {
        list: {
          project: true,
        },
        // numberFields: {
        //   field: true,
        // },
        stringFields: {
          field: true,
        },
        enumFields: {
          value: {
            field: true,
          },
        },
      },
      where: { id },
    });

    this.projectService.checkAuthor(authorId, card.list.project);

    return card;
  }

  async update(authorId: number, id: number, updateCardDto: UpdateCardDto) {
    console.log('update');

    const card = await this.findOne(authorId, id);

    updateCardDto.name && (card.name = updateCardDto.name);
    updateCardDto.description && (card.description = updateCardDto.description);

    if (
      updateCardDto.listId !== undefined &&
      updateCardDto.listId !== card.list.id
    ) {
      const list = await this.listService.findOne(
        authorId,
        updateCardDto.listId,
        false,
      );
      card.list = list;
    }

    // TODO: probably this should be in transaction
    if (updateCardDto.position !== undefined) {
      await this.checkPositionUpdateAll(card, updateCardDto.position);
      card.position = updateCardDto.position;
    }

    // BUG: due to TypeORM issues with circular relations, have to save without fieldValues
    await this.cardRepository.save({
      ...card,
      stringFields: undefined,
      enumFields: undefined,
    });

    if (updateCardDto.stringFields !== undefined) {
      card.stringFields = await this.fieldValueService.saveStringValues(
        authorId,
        updateCardDto.stringFields,
        card,
      );
    }

    if (updateCardDto.enumFields !== undefined) {
      card.enumFields = await this.fieldValueService.saveEnumValues(
        updateCardDto.enumFields,
        card,
      );
      console.log('update enum ok');
    }

    return card;

    // console.log('updated card:', card);
    // return this.cardRepository.save(card);
  }

  async remove(authorId: number, id: number): Promise<Card> {
    const card = await this.findOne(authorId, id);

    // fix positions
    await this.cardRepository
      .createQueryBuilder()
      .update(Card)
      .set({
        position: () => 'position - 1',
      })
      .where('listId = :listId AND position > :removedPosition', {
        listId: card.list.id,
        removedPosition: card.position,
      })
      .execute();

    return this.cardRepository.remove(card);
  }

  private async checkPositionUpdateAll(
    card: Card,
    newPosition: number,
  ): Promise<void> {
    const { position: oldPosition } = card;
    if (newPosition < 0) {
      // throw new PositionBadRangeError();
      throw new RpcException('Wrong Position Value');
    }

    const maxPosition = await this.getMaxPositionWithinList(card.list);
    console.log('maxPos', maxPosition);
    if (newPosition > maxPosition) {
      // throw new PositionBadRangeError();
      throw new RpcException('Wrong Position Value');
    }

    console.log('newPos', newPosition, 'oldPos', oldPosition);

    // right: move all with (position <= newPosition and position > oldPosition) to position-1
    // left: move all with (position >= newPosition and position < oldPosition) to position+1
    let whereClause = 'listId = :listId';
    whereClause += ` AND position ${newPosition > oldPosition ? '<=' : '>='} :newPosition`;
    whereClause += ` AND position ${newPosition > oldPosition ? '>' : '<'} :oldPosition`;
    const setClause = `position ${newPosition > oldPosition ? '-' : '+'} 1`;

    console.log('where', whereClause);
    console.log('set', setClause);

    await this.cardRepository
      .createQueryBuilder()
      .update(Card)
      .set({
        position: () => setClause,
      })
      .where(whereClause, {
        listId: card.list.id,
        newPosition,
        oldPosition,
      })
      .execute();
  }

  private async getMaxPositionWithinList(list: List): Promise<number> {
    const res = await this.cardRepository
      .createQueryBuilder('card')
      .select('MAX(card.position)', 'max')
      .where('card.listId = :listId', { listId: list.id })
      .getRawOne();

    if (res.max !== null) {
      return res.max;
    }

    return -1;
  }
}
