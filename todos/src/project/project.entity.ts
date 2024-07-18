import { ApiProperty } from '@nestjs/swagger';
import { CardField } from 'src/card-field/card-field.entity';
import { List } from 'src/list/list.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Project {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column()
  createdAt: Date;

  @ApiProperty({ type: () => List, isArray: true })
  @OneToMany(() => List, (list) => list.project)
  lists: List[];

  @ApiProperty({ type: () => CardField, isArray: true })
  @OneToMany(() => CardField, (cardField) => cardField.project)
  fields: CardField[];

  // @ManyToOne(() => User)
  @ApiProperty()
  @Column()
  authorId: number;
}
