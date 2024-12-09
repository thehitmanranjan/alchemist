import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ 
  collection: 'userPortfolios'  // Explicitly set the collection name
})
export class UserPortfolio extends Document {

  @Prop({ required: true })
  user_id: number;

  @Prop({ required: true })
  metal: string;

  @Prop({ required: true })
  symbol: string;

  @Prop({ required: true })
  investment_amount: number;

  @Prop({ required: true })
  allocation_percentage: number;

  @Prop({ required: true })
  previous_rate: number;

  @Prop({ required: true })
  weight: number;

  @Prop({ required: true })
  last_updated_at: Date;
}

export const UserPortfolioSchema = SchemaFactory.createForClass(UserPortfolio);