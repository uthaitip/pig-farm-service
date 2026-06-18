import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PigBatch } from 'src/schemas/pig-batch.schema';
import { MongoService } from './mongo/mongo.service';

@Injectable()
export class PigBatchService extends MongoService<PigBatch> {
  searchs = ['batchCode', 'batchName'];
  defaultPopulates = [
    { path: 'penId', populate: { path: 'houseId', select: 'houseCode houseName' } },
  ];

  constructor(@InjectModel(PigBatch.name) model: Model<PigBatch>) {
    super(model);
  }
}
