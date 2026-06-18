import paginate from 'mongoose-paginate-v2';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'sale_details', timestamps: true })
export class SaleDetail extends Document {
  declare _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Sale', required: true })
  saleId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'PigBatch', required: true })
  batchId: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ default: null })
  averageWeight: number;

  @Prop({ default: null })
  totalWeight: number;

  @Prop({ required: true, default: 0 })
  pricePerKg: number;

  @Prop({ required: true, default: 0 })
  amount: number;

  declare createdAt: Date;
  declare updatedAt: Date;
}

const SaleDetailSchema = SchemaFactory.createForClass(SaleDetail);
SaleDetailSchema.plugin(paginate);
export { SaleDetailSchema };
