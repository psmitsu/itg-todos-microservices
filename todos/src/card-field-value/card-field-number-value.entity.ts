import { List } from 'src/list/list.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CardField } from 'src/card-field/card-field.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class CardFieldNumberValue {
  // @ApiProperty()
  // @PrimaryColumn()
  // listId: number;

  @ManyToOne(() => List, { cascade: true })
  @JoinColumn({ name: 'listId' })
  list: List;

  // @ApiProperty()
  // @PrimaryColumn()
  // fieldId: number;

  @ManyToOne(() => CardField, { cascade: true })
  @JoinColumn({ name: 'fieldId' })
  field: CardField;

  @ApiProperty()
  @Column()
  value: number;
}
