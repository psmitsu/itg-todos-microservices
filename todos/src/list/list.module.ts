import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { ProjectModule } from 'src/project/project.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from './list.entity';

@Module({
  imports: [ProjectModule, TypeOrmModule.forFeature([List])],
  controllers: [ListController],
  providers: [ListService],
  exports: [ListService],
})
export class ListModule {}
