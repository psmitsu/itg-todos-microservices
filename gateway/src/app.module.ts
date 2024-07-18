import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [AuthModule, TodosModule],
})
export class AppModule {}
