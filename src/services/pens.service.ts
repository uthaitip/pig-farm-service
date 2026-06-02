import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pen } from 'src/schemas/pen.schema';
import { MongoService } from './mongo/mongo.service';

@Injectable()
export class PensService extends MongoService<Pen> {
  searchs = ['name'];

  constructor(@InjectModel(Pen.name) penModel: Model<Pen>) {
    super(penModel);
  }
}
