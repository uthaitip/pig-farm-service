import { DataAddress } from 'src/schemas/data-address.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoService } from './mongo/mongo.service';

@Injectable()
export class DataAddressService extends MongoService<DataAddress> {
  identities: string[] = ['_id', 'code'];

  constructor(@InjectModel(DataAddress.name) model: Model<DataAddress>) {
    super(model);
  }
}
