import paginate from 'mongoose-paginate-v2';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'feed_types', timestamps: true })
export class FeedType extends Document {
  declare _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  feedCode: string;

  @Prop({ required: true })
  feedName: string;

  @Prop({ required: true, enum: ['FEED', 'MEDICINE', 'VACCINE'], default: 'FEED' })
  category: string;

  @Prop({ default: null })
  unit: string;

  @Prop({ required: true, default: 0 })
  minimumQuantity: number;

  @Prop({ default: null })
  description: string;

  declare createdAt: Date;
  declare updatedAt: Date;
}

const FeedTypeSchema = SchemaFactory.createForClass(FeedType);
FeedTypeSchema.plugin(paginate);
export { FeedTypeSchema };
