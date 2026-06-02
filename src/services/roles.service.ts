import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from 'src/schemas/role.schema';
import { MongoService } from './mongo/mongo.service';

@Injectable()
export class RolesService extends MongoService<Role> {
  searchs = ['name'];

  constructor(@InjectModel(Role.name) roleModel: Model<Role>) {
    super(roleModel);
  }
}
