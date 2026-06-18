import paginate from 'mongoose-paginate-v2';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'sales', timestamps: true })
export class Sale extends Document {
  declare _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  saleNo: string;

  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customerId: Types.ObjectId;

  @Prop({ required: true })
  saleDate: string;

  @Prop({ required: true, default: 0 })
  totalQuantity: number;

  @Prop({ required: true, default: 0 })
  totalAmount: number;

  @Prop({ required: true, default: 'COMPLETED', enum: ['DRAFT', 'COMPLETED', 'CANCELLED'] })
  status: string;

  @Prop({ default: null })
  note: string;

  declare createdAt: Date;
  declare updatedAt: Date;
}

const SaleSchema = SchemaFactory.createForClass(Sale);
SaleSchema.plugin(paginate);
export { SaleSchema };
