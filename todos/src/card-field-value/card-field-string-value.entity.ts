import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { CardField } from 'src/card-field/card-field.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Card } from 'src/card/card.entity';

@Entity()
export class CardFieldStringValue {
  @ManyToOne(() => Card, (card) => card.stringFields, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'cardId',
    foreignKeyConstraintName: 'FK_card_field_string_value_card_id',
  })
  @PrimaryColumn({
    name: 'cardId',
    type: 'integer',
    primaryKeyConstraintName: 'PK_card_field_string_id',
  })
  card: Relation<Card>;

  @ManyToOne(() => CardField, (field) => field.stringFieldValues, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'fieldId',
    foreignKeyConstraintName: 'FK_card_field_string_value_field_id',
  })
  @PrimaryColumn({
    name: 'fieldId',
    type: 'integer',
    primaryKeyConstraintName: 'PK_card_field_string_id',
  })
  field: Relation<CardField>;

  @ApiProperty()
  @Column({ nullable: true })
  value: string;
}
