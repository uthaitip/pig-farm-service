import { MasterHouseType } from './../schemas/master-house-type';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoService } from './mongo/mongo.service';
import { Model } from 'mongoose';

@Injectable()
export class MasterHouseTypeService extends MongoService<MasterHouseType> {
  searchs = ['name', 'code'];

  constructor(
    @InjectModel(MasterHouseType.name)
    masterHouseTypeService: Model<MasterHouseType>,
  ) {
    super(masterHouseTypeService);
  }
}
