import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'thai_sub_districts' })
export class ThaiSubDistrict extends Document {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  name_th: string;

  @Prop({ required: true })
  name_en: string;

  @Prop({ required: true })
  district_id: number;

  @Prop({ required: true })
  zip_code: string;
}

export const ThaiSubDistrictSchema =
  SchemaFactory.createForClass(ThaiSubDistrict);
