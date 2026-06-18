import paginate from 'mongoose-paginate-v2';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'pens', timestamps: true })
export class Pen extends Document {
  declare _id: Types.ObjectId;

  @Prop({ required: true })
  penCode: string;

  @Prop({ required: true })
  penName: string;

  @Prop({ type: Types.ObjectId, ref: 'House', required: true })
  houseId: Types.ObjectId;

  @Prop({ required: true, default: 0 })
  capacity: number;

  @Prop({ required: true, default: 0 })
  currentCount: number;

  @Prop({ required: true, default: 'ACTIVE' })
  status: string;

  @Prop({ required: true, default: 'notFull' })
  statusPens: string;

  @Prop({ default: null })
  description: string;

  declare createdAt: Date;
  declare updatedAt: Date;
}

const PenSchema = SchemaFactory.createForClass(Pen);
PenSchema.plugin(paginate);
export { PenSchema };
