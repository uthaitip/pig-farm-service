import paginate from 'mongoose-paginate-v2';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'houses', timestamps: true })
export class House extends Document {
  declare _id: Types.ObjectId;

  @Prop({ required: true })
  houseCode: string;

  @Prop({ required: true })
  houseName: string;

  @Prop({ type: Types.ObjectId, ref: 'MasterHouseType', required: true })
  houseTypeId: Types.ObjectId;

  @Prop({ required: true, default: 'ACTIVE' })
  status: string;

  @Prop({ default: null })
  description: string;

  declare createdAt: Date;
  declare updatedAt: Date;
}

const HouseSchema = SchemaFactory.createForClass(House);
HouseSchema.plugin(paginate);
export { HouseSchema };
