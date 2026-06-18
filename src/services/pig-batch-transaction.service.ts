import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PigBatchTransaction } from 'src/schemas/pig-batch-transaction.schema';
import { MongoService } from './mongo/mongo.service';

@Injectable()
export class PigBatchTransactionService extends MongoService<PigBatchTransaction> {
  searchs = ['transactionType', 'remark'];

  constructor(@InjectModel(PigBatchTransaction.name) model: Model<PigBatchTransaction>) {
    super(model);
  }
}
