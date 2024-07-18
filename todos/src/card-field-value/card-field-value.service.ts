import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CardFieldStringValue } from './card-field-string-value.entity';
import { Repository } from 'typeorm';
import { Card } from 'src/card/card.entity';
import { CardField } from 'src/card-field/card-field.entity';
import { CardFieldService } from 'src/card-field/card-field.service';
import { CardFieldEnumDto, CardFieldStringDto } from 'src/card/dto/create-card.dto';
import { EnumValue } from 'src/card-field/enum-value.entity';
import { CardFieldEnumValue } from './card-field-enum-value.entity';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class CardFieldValueService {
  constructor(
    @InjectRepository(CardFieldStringValue)
    private cardFieldStringRepository: Repository<CardFieldStringValue>,
    @InjectRepository(CardFieldEnumValue)
    private cardFieldEnumRepository: Repository<CardFieldEnumValue>,
    private fieldService: CardFieldService,
  ) {}

  async findStringValue(
    field: CardField,
    card: Card,
  ): Promise<CardFieldStringValue> {
    return this.cardFieldStringRepository.findOne({
      where: { field, card },
    });
  }

  // BUG: TypeORM has troubles with circular references, had to play around them with copy
  async saveStringValues(
    authorId: number,
    fieldValueDtos: CardFieldStringDto[],
    card: Card,
  ): Promise<CardFieldStringValue[]> {
    let fieldValues = await Promise.all(
      fieldValueDtos.map(async (dto) => {
        const old = card.stringFields?.find(
          (val) => val.field.id === dto.fieldId,
        );

        console.log('old value found:', old);

        if (old !== undefined) {
          // rewrite string value
          if (dto.value !== null) {
            old.card = <any>{ id: card.id };
            old.value = dto.value;
            return old;
          } else {
            // null in dto deletes value
            console.log('delete');
            this.cardFieldStringRepository.delete(old);
          }
        } else {
          // write new string value
          const field = await this.fieldService.findOne(authorId, dto.fieldId);
          if (field.project.id !== card.list.project.id) {
            throw new RpcException('Unauthorized');
          }

          const newValue = new CardFieldStringValue();
          newValue.card = <any>{ id: card.id };
          newValue.field = <any>{ id: field.id };
          newValue.value = dto.value;
          return newValue;
        }
      }),
    );

    // quick fix: remove undefined values which we get in delete old section
    fieldValues = fieldValues.filter((val) => val !== undefined);

    if (fieldValues.length > 0) {
      console.log('attempting to save field values:', fieldValues);
      await this.cardFieldStringRepository.save(fieldValues);
    }

    return fieldValues;
  }

  async saveEnumValues(enumValueDtos: CardFieldEnumDto[], card: Card) {
    let fieldValues = await Promise.all(
      enumValueDtos.map(async (dto) => {
        const old = card.enumFields?.find(
          (val) => val.value.field.id === dto.fieldId,
        );
        console.log('old value found:', old);

        // DTO: cardField=N, value=NULL - delete
        if (old !== undefined && dto.valueId === null) {
          console.log('delete');
          this.cardFieldEnumRepository.delete(old);
        } else {
          const newEnumValue = await this.fieldService.findEnumValue(
            dto.valueId,
          );

          // attempting to access other user's enum field
          if (newEnumValue.field.project.id !== card.list.project.id) {
            throw new RpcException('Unauthorized');
          }

          // DTO: cardField=N, value=M, this field is present - update
          if (old !== undefined && old.value.id !== dto.valueId) {
            old.card = <any>{ id: card.id };
            old.value = newEnumValue;
            return old;
          }
          // DTO: cardField=N, value=M, this field is not present - create new
          else {
            const newValue = new CardFieldEnumValue();
            newValue.card = <any>{ id: card.id };
            newValue.value = newEnumValue;
            return newValue;
          }
        }
      }),
    );

    // quick fix: remove undefined values which we get in delete old section
    fieldValues = fieldValues.filter((val) => val !== undefined);

    if (fieldValues.length > 0) {
      console.log('attempting to save field values:', fieldValues);
      await this.cardFieldEnumRepository.save(fieldValues);
    }

    return fieldValues;
  }
}
