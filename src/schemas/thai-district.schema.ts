import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'thai_districts' })
export class ThaiDistrict extends Document {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  name_th: string;

  @Prop({ required: true })
  name_en: string;

  @Prop({ required: true })
  province_id: number;
}

export const ThaiDistrictSchema = SchemaFactory.createForClass(ThaiDistrict);
