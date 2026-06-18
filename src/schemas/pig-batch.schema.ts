import paginate from 'mongoose-paginate-v2';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'pig_batches', timestamps: true })
export class PigBatch extends Document {
  declare _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  batchCode: string;

  @Prop({ default: null })
  batchName: string;

  @Prop({ type: Types.ObjectId, ref: 'Pen', required: true })
  penId: Types.ObjectId;

  @Prop({ required: true, enum: ['BORN', 'PURCHASED'] })
  sourceType: string;

  @Prop({ required: true })
  receivedDate: string;

  @Prop({ required: true, default: 0 })
  initialQuantity: number;

  @Prop({ required: true, default: 0 })
  currentQuantity: number;

  @Prop({ default: null })
  averageWeight: number;

  @Prop({ required: true, default: 'ACTIVE', enum: ['ACTIVE', 'CLOSED'] })
  status: string;

  @Prop({ default: null })
  description: string;

  declare createdAt: Date;
  declare updatedAt: Date;
}

const PigBatchSchema = SchemaFactory.createForClass(PigBatch);
PigBatchSchema.plugin(paginate);
export { PigBatchSchema };
