import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExpenseCategory } from 'src/schemas/expense-category.schema';
import { MongoService } from './mongo/mongo.service';

@Injectable()
export class ExpenseCategoryService extends MongoService<ExpenseCategory> {
  searchs = ['code', 'name'];

  constructor(@InjectModel(ExpenseCategory.name) model: Model<ExpenseCategory>) {
    super(model);
  }
}
