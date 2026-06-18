import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { House } from 'src/schemas/house.schema';
import { MongoService } from './mongo/mongo.service';

@Injectable()
export class HousesService extends MongoService<House> {
  searchs = ['houseName', 'houseCode'];
  defaultPopulates = [{ path: 'houseTypeId' }];

  constructor(@InjectModel(House.name) houseModel: Model<House>) {
    super(houseModel);
  }
}
