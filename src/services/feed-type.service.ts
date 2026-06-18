import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FeedType } from 'src/schemas/feed-type.schema';
import { MongoService } from './mongo/mongo.service';

@Injectable()
export class FeedTypeService extends MongoService<FeedType> {
  searchs = ['feedCode', 'feedName'];

  constructor(@InjectModel(FeedType.name) model: Model<FeedType>) {
    super(model);
  }
}
