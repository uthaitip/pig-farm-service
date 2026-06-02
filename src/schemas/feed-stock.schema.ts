import paginate from 'mongoose-paginate-v2';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'feed_stocks' })
export class FeedStock extends Document {
  declare _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: null })
  unit: string;

  @Prop({ default: 0 })
  quantity: number;

  @Prop({ default: 0 })
  minQuantity: number;

  @Prop({ default: 'active' })
  status: string;

  @Prop({ default: null })
  note: string;

  @Prop({ default: null })
  createdUser: string;

  @Prop({ default: null })
  updatedUser: string;

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;
}

const FeedStockSchema = SchemaFactory.createForClass(FeedStock);
FeedStockSchema.plugin(paginate);
export { FeedStockSchema };
