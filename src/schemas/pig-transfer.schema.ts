import paginate from 'mongoose-paginate-v2';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'pig_transfers' })
export class PigTransfer extends Document {
  declare _id: Types.ObjectId;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  fromPenId: string;

  @Prop()
  fromPenName: string;

  @Prop({ required: true })
  toPenId: string;

  @Prop()
  toPenName: string;

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

const PigTransferSchema = SchemaFactory.createForClass(PigTransfer);
PigTransferSchema.plugin(paginate);
export { PigTransferSchema };
