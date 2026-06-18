import paginate from 'mongoose-paginate-v2';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'pig_batch_transactions', timestamps: true })
export class PigBatchTransaction extends Document {
  declare _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'PigBatch', required: true })
  batchId: Types.ObjectId;

  @Prop({
    required: true,
    enum: ['RECEIVE', 'MOVE_IN', 'MOVE_OUT', 'DEAD', 'SOLD', 'ADJUST'],
  })
  transactionType: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  transactionDate: string;

  @Prop({ default: null })
  fromPenId: string;

  @Prop({ default: null })
  toPenId: string;

  @Prop({ default: null })
  remark: string;

  @Prop({ default: null })
  employeeId: string;

  declare createdAt: Date;
}

const PigBatchTransactionSchema = SchemaFactory.createForClass(PigBatchTransaction);
PigBatchTransactionSchema.plugin(paginate);
export { PigBatchTransactionSchema };
