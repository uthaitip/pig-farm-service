import paginate from 'mongoose-paginate-v2';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'buyers' })
export class Buyer extends Document {
  declare _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: null, unique: true, sparse: true })
  customerCode: string;

  @Prop({ default: null })
  phone: string;

  @Prop({ default: null })
  note: string;

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

const BuyerSchema = SchemaFactory.createForClass(Buyer);
BuyerSchema.plugin(paginate);
export { BuyerSchema };
