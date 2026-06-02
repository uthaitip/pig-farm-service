import paginate from 'mongoose-paginate-v2';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'pig_weights' })
export class PigWeight extends Document {
  declare _id: Types.ObjectId;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  penId: string;

  @Prop()
  penName: string;

  @Prop({ required: true })
  weightAvg: number;

  @Prop({ default: null })
  sampleCount: number;

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

const PigWeightSchema = SchemaFactory.createForClass(PigWeight);
PigWeightSchema.plugin(paginate);
export { PigWeightSchema };
