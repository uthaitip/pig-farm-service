import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

@Schema({ collection: 'masterHouseTypes' })
export class MasterHouseType extends Document {
  declare _id: Types.ObjectId;
  @Prop()
  code: string;

  @Prop()
  name: string;

  @Prop()
  note: string;

  @Prop()
  status: string;
}

export const MasterHouseTypeSchema =
  SchemaFactory.createForClass(MasterHouseType);
MasterHouseTypeSchema.plugin(paginate);
