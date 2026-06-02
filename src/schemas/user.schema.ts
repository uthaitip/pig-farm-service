import paginate from 'mongoose-paginate-v2';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'users' })
export class User extends Document {
  declare _id: Types.ObjectId;

  @Prop({ required: true })
  fullName: string;

  @Prop({ default: null })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: null })
  phone: string;

  @Prop({ default: null, unique: true, sparse: true, index: true })
  customerCode: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ default: 'active' })
  status: string;

  @Prop({ default: null })
  roleId: string;

  @Prop({ default: null })
  createdUser: string;

  @Prop({ default: null })
  updatedUser: string;

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;
}

const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(paginate);
export { UserSchema };
