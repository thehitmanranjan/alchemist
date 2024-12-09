import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Metal extends Document {
  @Prop({ required: true })
  metalId: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  symbol: string;

  @Prop({ required: true })
  currentPrice: number;

  @Prop({ required: true })
  lastUpdated: Date;
}

export const MetalSchema = SchemaFactory.createForClass(Metal);