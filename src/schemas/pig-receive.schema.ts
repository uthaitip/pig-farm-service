import paginate from 'mongoose-paginate-v2';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'pig_receives' })
export class PigReceive extends Document {
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
  source: string;

  @Prop({ default: null })
  weightAvg: number;

  @Prop({ default: null })
  pricePerUnit: number;

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

const PigReceiveSchema = SchemaFactory.createForClass(PigReceive);
PigReceiveSchema.plugin(paginate);
export { PigReceiveSchema };
