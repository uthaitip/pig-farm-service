import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

@Schema({ collection: 'otpSessions' })
export class OtpSession extends Document {
  declare _id: Types.ObjectId;

  @Prop() userId: Types.ObjectId;

  @Prop() phone: string;

  @Prop() otp: string;

  @Prop() ref: string;

  @Prop({ default: 0 })
  mistakeCount: number;

  @Prop({ default: 'pending' })
  status: string;

  @Prop({ default: null })
  verifiedAt: string;

  @Prop() createdAt: string;

  @Prop() expiredAt: string;
}

export const OtpSessionSchema = SchemaFactory.createForClass(OtpSession);
OtpSessionSchema.plugin(paginate);
