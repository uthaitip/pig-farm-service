import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sale } from 'src/schemas/sale.schema';
import { MongoService } from './mongo/mongo.service';

@Injectable()
export class SaleService extends MongoService<Sale> {
  searchs = ['saleNo'];
  defaultPopulates = [{ path: 'customerId' }];

  constructor(@InjectModel(Sale.name) model: Model<Sale>) {
    super(model);
  }
}
