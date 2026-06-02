import paginate from 'mongoose-paginate-v2';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'menus' })
export class Menu extends Document {
  declare _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: null })
  path: string;

  @Prop({ default: null })
  icon: string;

  @Prop({ default: null })
  parentId: string;

  @Prop({ default: 0 })
  sort: number;

  @Prop({ default: 'active' })
  status: string;

  @Prop({ default: null })
  createdUser: string;

  @Prop({ default: null })
  updatedUser: string;

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;
}

const MenuSchema = SchemaFactory.createForClass(Menu);
MenuSchema.plugin(paginate);
export { MenuSchema };
