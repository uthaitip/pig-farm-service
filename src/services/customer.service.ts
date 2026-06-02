import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from 'src/schemas/customer.schema';
import { MongoService } from './mongo/mongo.service';

@Injectable()
export class CustomerService extends MongoService<Customer> {
  searchs = ['fullName', 'firstName', 'lastName', 'phoneNumber'];

  constructor(@InjectModel(Customer.name) useModel: Model<Customer>) {
    super(useModel);
  }
}
