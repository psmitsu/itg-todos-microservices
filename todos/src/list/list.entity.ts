import { ApiProperty } from '@nestjs/swagger';
import { Card } from 'src/card/card.entity';
import { Project } from 'src/project/project.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class List {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  position: number;

  @ApiProperty()
  @Column()
  createdAt: Date;

  @ApiProperty({ type: () => Project })
  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  project: Project;

  @ApiProperty({ type: () => Card, isArray: true })
  @OneToMany(() => Card, (card) => card.list)
  cards: Card[];
}
