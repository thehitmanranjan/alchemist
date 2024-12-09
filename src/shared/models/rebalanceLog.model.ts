import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class RebalanceLog extends Document {
  @Prop({ required: true })
  rebalanceId: number;

  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  oldAllocation: { Gold: number, Silver: number };

  @Prop({ required: true })
  newAllocation: { Gold: number, Silver: number };

  @Prop({ required: true })
  rebalancedAt: Date;
}

export const RebalanceLogSchema = SchemaFactory.createForClass(RebalanceLog);