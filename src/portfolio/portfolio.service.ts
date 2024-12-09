import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from '../users/models/transaction.model';
import { User } from '../users/models/user.model';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PortfolioResponseDto } from './dto/profile-response.dto';
import { UserPortfolio } from './models/userPorfolio.model';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(UserPortfolio.name)
    private readonly userPortfolioModel: Model<UserPortfolio>,
  ) {}

  private async getNextTransactionId(): Promise<number> {
    const lastTransaction = await this.transactionModel
      .findOne()
      .sort({ transactionId: -1 })
      .exec();
    return lastTransaction ? lastTransaction.transactionId + 1 : 1;
  }

  private async getUser(userId: number): Promise<User> {
    const user = await this.userModel.findOne({ userId: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  private async updateUserBalance(userId: number, amount: number): Promise<void> {
    const result = await this.userModel.updateOne(
      { userId: userId },
      { $inc: { balance: amount } },
      { $inc: { totalInvestment: amount } },
    );

    if (result.modifiedCount === 0) {
      throw new Error('Failed to update user balance');
    }
  }

  private async createTransaction(
    dto: CreateTransactionDto,
    type: 'BUY' | 'SELL',
  ): Promise<Transaction> {
    const transactionId = await this.getNextTransactionId();
    
    const transaction = new this.transactionModel({
      transactionId,
      userId: dto.userId,
      transactionType: type,
      totalAmount: dto.amount,
      transactionDate: new Date(),
    });

    return transaction.save();
  }

  async buyMetal(dto: CreateTransactionDto): Promise<Transaction> {
    try {
      // Validate input
      if (dto.amount <= 0) {
        throw new Error('Buy amount must be greater than 0');
      }

      // Get user and check balance
      const user = await this.getUser(dto.userId);

      // Start transaction
      const session = await this.transactionModel.db.startSession();
      let transaction: Transaction;

      try {
        await session.withTransaction(async () => {
          // Deduct amount from user's balance
          await this.updateUserBalance(dto.userId, dto.amount);
          
          // Create transaction record
          transaction = await this.createTransaction(dto, 'BUY');
        });
      } finally {
        await session.endSession();
      }

      return transaction;
    } catch (error) {
      throw new Error(`Failed to process buy transaction: ${error.message}`);
    }
  }

  async sellMetal(dto: CreateTransactionDto): Promise<Transaction> {
    try {
      // Validate input
      if (dto.amount <= 0) {
        throw new Error('Sell amount must be greater than 0');
      }

      // Get user and check balance
      const user = await this.getUser(dto.userId);
      if (dto.amount > user.balance) {
        throw new Error('Insufficient metal balance for sale');
      }

      // Start transaction
      const session = await this.transactionModel.db.startSession();
      let transaction: Transaction;

      try {
        await session.withTransaction(async () => {
          // Add amount to user's balance for the sale
          await this.updateUserBalance(dto.userId, -dto.amount);
          
          // Create transaction record
          transaction = await this.createTransaction(dto, 'SELL');
        });
      } finally {
        await session.endSession();
      }

      return transaction;
    } catch (error) {
      throw new Error(`Failed to process sell transaction: ${error.message}`);
    }
  }

  async getUserPortfolio(userId: number): Promise<PortfolioResponseDto> {
    // Fetch user data to get balance
    const user = await this.userModel.findOne({ userId }).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const allDocs = await this.userPortfolioModel.find({}).lean().exec();

    // Fetch portfolio items for the user
    const portfolioItems = await this.userPortfolioModel
    .find({ user_id: userId })  // Changed from userId to user_id
    .lean()
    .exec();

    // Calculate total investment
    const totalInvestment = portfolioItems.reduce(
      (sum, item) => sum + item.investment_amount,
      0
    );

    // Transform the data to match the response DTO
    const transformedPortfolioItems = portfolioItems.map(item => ({
      metal: item.metal,
      symbol: item.symbol,
      investmentAmount: item.investment_amount,
      allocationPercentage: item.allocation_percentage,
      rate: item.previous_rate,
      weight: item.weight,
      lastUpdatedAt: item.last_updated_at
    }));

    return {
      balance: user.balance,
      totalInvestment,
      portfolioItems: transformedPortfolioItems
    };
  }
}