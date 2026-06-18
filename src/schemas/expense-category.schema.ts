import paginate from 'mongoose-paginate-v2';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'expense_categories', timestamps: true })
export class ExpenseCategory extends Document {
  declare _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: null })
  description: string;

  @Prop({ required: true, default: true })
  isActive: boolean;

  declare createdAt: Date;
  declare updatedAt: Date;
}

const ExpenseCategorySchema = SchemaFactory.createForClass(ExpenseCategory);
ExpenseCategorySchema.plugin(paginate);
export { ExpenseCategorySchema };
