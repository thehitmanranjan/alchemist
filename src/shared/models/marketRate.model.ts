import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class MarketRate extends Document {
  @Prop({ required: true })
  rateId: number;

  @Prop({ required: true })
  metalId: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true , name: 'recorded_at' })
  recordedAt: Date;
}

export const MarketRateSchema = SchemaFactory.createForClass(MarketRate);