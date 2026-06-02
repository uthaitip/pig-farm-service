import paginate from 'mongoose-paginate-v2';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'pig_sales' })
export class PigSale extends Document {
  declare _id: Types.ObjectId;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  penId: string;

  @Prop()
  penName: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  reason: string;

  @Prop({ default: null })
  pricePerUnit: number;

  @Prop({ default: null })
  buyerId: string;

  @Prop({ default: null })
  buyer: string;

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

const PigSaleSchema = SchemaFactory.createForClass(PigSale);
PigSaleSchema.plugin(paginate);
export { PigSaleSchema };
