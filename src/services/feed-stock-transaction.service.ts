import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PopulateOptions } from 'mongoose';
import { FeedStockTransaction } from 'src/schemas/feed-stock-transaction.schema';
import { MongoService } from './mongo/mongo.service';

@Injectable()
export class FeedStockTransactionService extends MongoService<FeedStockTransaction> {
  searchs = ['note'];
  defaultPopulates: PopulateOptions[] = [
    { path: 'userId',      select: 'fullName username' },
    { path: 'updatedUser', select: 'fullName username' },
  ];

  constructor(@InjectModel(FeedStockTransaction.name) model: Model<FeedStockTransaction>) {
    super(model);
  }
}
