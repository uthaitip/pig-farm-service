import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'thai_provinces' })
export class ThaiProvince extends Document {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  name_th: string;

  @Prop({ required: true })
  name_en: string;

  @Prop({ required: true })
  geography_id: number;
}

export const ThaiProvinceSchema = SchemaFactory.createForClass(ThaiProvince);
