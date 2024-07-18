import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './card.entity';
import { ListModule } from 'src/list/list.module';
import { ProjectModule } from 'src/project/project.module';
import { CardFieldValueModule } from 'src/card-field-value/card-field-value.module';
import { CardFieldModule } from 'src/card-field/card-field.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Card]),
    CardFieldValueModule,
    CardFieldModule,
    CardFieldModule,
    ListModule,
    ProjectModule,
  ],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
