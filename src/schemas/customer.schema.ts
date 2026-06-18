import paginate from 'mongoose-paginate-v2';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'customers', timestamps: true })
export class Customer extends Document {
  declare _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  customerCode: string;

  @Prop({ required: true })
  customerName: string;

  @Prop({ default: null })
  phoneNumber: string;

  @Prop({ default: null })
  houseNo: string;

  @Prop({ default: null })
  soi: string;

  @Prop({ default: null })
  road: string;

  @Prop({ default: null })
  address: string;

  @Prop({ default: null })
  provinceId: number;

  @Prop({ default: null })
  provinceName: string;

  @Prop({ default: null })
  districtId: number;

  @Prop({ default: null })
  districtName: string;

  @Prop({ default: null })
  subDistrictId: number;

  @Prop({ default: null })
  subDistrictName: string;

  @Prop({ default: null })
  zipCode: string;

  @Prop({ required: true, default: 'ACTIVE', enum: ['ACTIVE', 'INACTIVE'] })
  status: string;

  @Prop({ default: null })
  note: string;

  declare createdAt: Date;
  declare updatedAt: Date;
}

const CustomerSchema = SchemaFactory.createForClass(Customer);
CustomerSchema.plugin(paginate);
export { CustomerSchema };
