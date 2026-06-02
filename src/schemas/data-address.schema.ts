import paginate from 'mongoose-paginate-v2';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'data-addresses' })
export class DataAddress extends Document {
  declare _id: Types.ObjectId;

  @Prop({ type: String, index: true })
  code: string;

  @Prop({ type: String, index: true })
  customerCode: string;

  @Prop()
  houseCode: string;

  @Prop()
  houseNo: string;

  @Prop()
  villageNo: string;

  @Prop()
  villageName: string;

  @Prop()
  alley: string;

  @Prop()
  lane: string;

  @Prop()
  road: string;

  @Prop()
  subDistrictCode: string;

  @Prop()
  districtCode: string;

  @Prop()
  provinceCode: string;

  @Prop()
  postalCode: string;

  @Prop()
  addressTypeId: string;

  @Prop({ default: 0 })
  isDefault: number;

  @Prop({ default: 0 })
  isIdCard: number;

  @Prop({ default: 1 })
  isActive: number;

  @Prop({ default: null })
  createdUser: string;

  @Prop({ default: null })
  updatedUser: string;

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;

  @Prop()
  fullAddress: string;
}

export const DataAddressSchema = SchemaFactory.createForClass(DataAddress);
DataAddressSchema.plugin(paginate);
