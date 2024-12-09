import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ required: true })
  transactionId: number;

  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  transactionType: string;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true })
  transactionDate: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);