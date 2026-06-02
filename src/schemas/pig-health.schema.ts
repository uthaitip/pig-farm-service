import paginate from 'mongoose-paginate-v2';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'pig_healths' })
export class PigHealth extends Document {
  declare _id: Types.ObjectId;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  penId: string;

  @Prop()
  penName: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  detail: string;

  @Prop({ default: null })
  quantity: number;

  @Prop({ default: null })
  cost: number;

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

const PigHealthSchema = SchemaFactory.createForClass(PigHealth);
PigHealthSchema.plugin(paginate);
export { PigHealthSchema };
