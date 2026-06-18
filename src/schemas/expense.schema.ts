import paginate from 'mongoose-paginate-v2';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'expenses', timestamps: true })
export class Expense extends Document {
  declare _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  expenseNo: string;

  @Prop({ type: Types.ObjectId, ref: 'ExpenseCategory', required: true })
  expenseCategoryId: Types.ObjectId;

  @Prop({ required: true })
  expenseDate: string;

  @Prop({ required: true, default: 0 })
  amount: number;

  @Prop({ default: null })
  description: string;

  @Prop({ default: null })
  attachment: string;

  @Prop({ default: null })
  createdBy: string;

  declare createdAt: Date;
  declare updatedAt: Date;
}

const ExpenseSchema = SchemaFactory.createForClass(Expense);
ExpenseSchema.plugin(paginate);
export { ExpenseSchema };
