import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from 'src/schemas/todo.schema';
import { MongoService } from './mongo/mongo.service';

@Injectable()
export class TodoService extends MongoService<Todo> {
  searchs = ['title'];

  constructor(@InjectModel(Todo.name) todoModel: Model<Todo>) {
    super(todoModel);
  }
}
