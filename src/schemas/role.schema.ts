import paginate from 'mongoose-paginate-v2';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'roles' })
export class Role extends Document {
  declare _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: null })
  description: string;

  @Prop({ default: 'active' })
  status: string;

  @Prop({ type: [String], default: [] })
  menuIds: string[];

  @Prop({ default: null })
  createdUser: string;

  @Prop({ default: null })
  updatedUser: string;

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;
}

const RoleSchema = SchemaFactory.createForClass(Role);
RoleSchema.plugin(paginate);
export { RoleSchema };
