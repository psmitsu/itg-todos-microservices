import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectModule } from './project/project.module';
import { ListModule } from './list/list.module';
import { CardModule } from './card/card.module';
import { CardFieldModule } from './card-field/card-field.module';
import { CardFieldValueModule } from './card-field-value/card-field-value.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST,
      port: <any>process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      synchronize: true,
      autoLoadEntities: true,
      // entities: [User, Project, List, Card],
    }),
    ProjectModule,
    ListModule,
    CardModule,
    CardFieldModule,
    CardFieldValueModule,
  ],
})
export class AppModule {}
