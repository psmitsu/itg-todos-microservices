import { List } from 'src/list/list.entity';
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CardFieldStringValue } from 'src/card-field-value/card-field-string-value.entity';
import { IsOptional, isArray } from 'class-validator';
import { CardFieldEnumValue } from 'src/card-field-value/card-field-enum-value.entity';

@Entity()
export class Card {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ nullable: true })
  description: string;

  @ApiProperty()
  @Column()
  createdAt: Date;

  @ApiProperty()
  @Column()
  position: number;

  @ApiProperty({ type: () => List })
  @ManyToOne(() => List, { onDelete: 'CASCADE' })
  list: List;

  // @ApiProperty({
  //   type: () => CardFieldNumberValue,
  //   isArray: true,
  // })
  // @OneToMany(() => CardFieldNumberValue, (cardField) => cardField.list)
  // numberFields: CardFieldNumberValue[];

  @ApiProperty({
    type: () => CardFieldStringValue,
    isArray: true,
  })
  @OneToMany(
    () => CardFieldStringValue,
    (cardFieldValue) => cardFieldValue.card,
  )
  stringFields: Relation<CardFieldStringValue>[];

  @ApiProperty({
    type: () => CardFieldEnumValue,
    isArray: true,
  })
  @OneToMany(
    () => CardFieldEnumValue,
    (cardFieldEnumValue) => cardFieldEnumValue.card,
  )
  enumFields: CardFieldEnumValue[];
}
