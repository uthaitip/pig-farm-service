import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common.module';
import { TodoController } from './controllers/crud.controller';
import { TodoService } from 'src/services/todo.service';

@Module({
  imports: [CommonModule],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
