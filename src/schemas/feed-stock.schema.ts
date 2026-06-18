import paginate from 'mongoose-paginate-v2';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'feed_stocks', timestamps: true })
export class FeedStock extends Document {
  declare _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'FeedType', required: true, unique: true })
  feedTypeId: Types.ObjectId;

  @Prop({ required: true, default: 0 })
  currentQuantity: number;

  declare createdAt: Date;
  declare updatedAt: Date;
}

const FeedStockSchema = SchemaFactory.createForClass(FeedStock);
FeedStockSchema.plugin(paginate);
export { FeedStockSchema };
