import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expense } from 'src/schemas/expense.schema';
import { MongoService } from './mongo/mongo.service';

@Injectable()
export class ExpenseService extends MongoService<Expense> {
  searchs = ['expenseNo', 'description'];

  constructor(@InjectModel(Expense.name) model: Model<Expense>) {
    super(model);
  }
}
