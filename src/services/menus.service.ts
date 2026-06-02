import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Menu } from 'src/schemas/menu.schema';
import { MongoService } from './mongo/mongo.service';

@Injectable()
export class MenusService extends MongoService<Menu> {
  searchs = ['name'];

  constructor(@InjectModel(Menu.name) menuModel: Model<Menu>) {
    super(menuModel);
  }
}
