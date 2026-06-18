import paginate from 'mongoose-paginate-v2';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'feed_stock_transactions', timestamps: true })
export class FeedStockTransaction extends Document {
  declare _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'FeedType', required: true })
  feedTypeId: Types.ObjectId;

  @Prop({ required: true, enum: ['IN', 'OUT', 'ADJUST'] })
  transactionType: string;

  @Prop({ required: true })
  transactionDate: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ default: null })
  unitPrice: number;

  @Prop({ default: null })
  totalAmount: number;

  @Prop({ type: Types.ObjectId, ref: 'PigBatch', default: null })
  batchId: Types.ObjectId;

  @Prop({ default: null })
  note: string;

  @Prop({ default: null })
  createdBy: string;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  updatedUser: Types.ObjectId;

  declare createdAt: Date;
  declare updatedAt: Date;
}

const FeedStockTransactionSchema = SchemaFactory.createForClass(FeedStockTransaction);
FeedStockTransactionSchema.plugin(paginate);
export { FeedStockTransactionSchema };
