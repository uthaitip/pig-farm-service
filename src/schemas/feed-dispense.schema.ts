import paginate from 'mongoose-paginate-v2';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'feed_dispenses' })
export class FeedDispense extends Document {
  declare _id: Types.ObjectId;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  feedStockId: string;

  @Prop()
  feedName: string;

  @Prop({ required: true })
  penId: string;

  @Prop()
  penName: string;

  @Prop({ required: true })
  quantity: number;

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

const FeedDispenseSchema = SchemaFactory.createForClass(FeedDispense);
FeedDispenseSchema.plugin(paginate);
export { FeedDispenseSchema };
