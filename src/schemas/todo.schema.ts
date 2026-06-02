import paginate from 'mongoose-paginate-v2';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'todo' })
export class Todo extends Document {
  declare _id: Types.ObjectId;

  @Prop()
  title: string;

  @Prop()
  note: string;

  @Prop()
  status: boolean;
}

const TodoSchema = SchemaFactory.createForClass(Todo);
TodoSchema.plugin(paginate);

export { TodoSchema };
