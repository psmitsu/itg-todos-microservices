import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CardField } from './card-field.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class EnumValue {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  value: string;

  @ManyToOne(() => CardField, { onDelete: 'CASCADE' })
  field: CardField;
}
