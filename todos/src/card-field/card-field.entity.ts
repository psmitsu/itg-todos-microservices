import { ApiProperty } from '@nestjs/swagger';
import { CardFieldStringValue } from 'src/card-field-value/card-field-string-value.entity';
import { Project } from 'src/project/project.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EnumValue } from './enum-value.entity';

export enum FieldType {
  STRING = 'string',
  NUMBER = 'number',
  ENUM = 'enum',
}

@Entity()
export class CardField {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty({ type: () => Project })
  @ManyToOne(() => Project, { nullable: true })
  project: Project;

  @ApiProperty({ enum: ['STRING', 'NUMBER'] })
  @Column({
    type: 'enum',
    enum: FieldType,
    default: FieldType.STRING,
  })
  type: FieldType;

  @OneToMany(() => EnumValue, (enumValue) => enumValue.field, {
    nullable: true,
  })
  enumValues: EnumValue[];

  @OneToMany(() => CardFieldStringValue, (fieldValue) => fieldValue.field)
  stringFieldValues: CardFieldStringValue[];
}
