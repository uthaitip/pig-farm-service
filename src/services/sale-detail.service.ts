import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SaleDetail } from 'src/schemas/sale-detail.schema';
import { MongoService } from './mongo/mongo.service';

@Injectable()
export class SaleDetailService extends MongoService<SaleDetail> {
  searchs = [];

  constructor(@InjectModel(SaleDetail.name) model: Model<SaleDetail>) {
    super(model);
  }
}
