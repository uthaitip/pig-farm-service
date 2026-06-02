import paginate from 'mongoose-paginate-v2';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'customers' })
export class Customer extends Document {
  declare _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  customerCode: string;

  @Prop({ default: null })
  citizenId: string;

  @Prop({ default: null })
  genderCode: string;

  @Prop({ default: null })
  firstName: string;

  @Prop({ default: null })
  lastName: string;

  @Prop({ default: null })
  firstNameEn: string;

  @Prop({ default: null })
  lastNameEn: string;

  @Prop({ default: null })
  fullName: string;

  @Prop({ default: null })
  birthDate: string;

  @Prop({ default: null })
  issueDate: string;

  @Prop({ default: null })
  issuePlace: string;

  @Prop({ default: null })
  expirationDate: string;

  @Prop({ default: null })
  email: string;

  @Prop({ default: null })
  nationality: string;

  @Prop({ default: null })
  phoneNumber: string;

  @Prop({ default: null })
  lineId: string;

  @Prop({ default: 'active' })
  status: string;

  @Prop({ default: null })
  createdUser: string;

  @Prop({ default: null })
  updatedUser: string;

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;
}

const CustomerSchema = SchemaFactory.createForClass(Customer);
CustomerSchema.plugin(paginate);
export { CustomerSchema };
