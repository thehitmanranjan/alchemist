import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../models/user.model';
import { CreateUserDto } from '../dto/create-user.dto';
import { Transaction } from '../models/transaction.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) 
    private userModel: Model<User>,
    @InjectModel(Transaction.name) 
    private transactionModel: Model<Transaction>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    try {
      // Create new user
      const newUser = new this.userModel({
        userId: await this.generateUniqueUserId(),
        name,
        email,
        passwordHash,
        balance: 0.0,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Save user to database
      const savedUser = await newUser.save();

      // Remove sensitive information before returning
      const userResponse = savedUser.toObject();
      delete userResponse.passwordHash;
      return userResponse;
    } catch (error) {
      // Handle potential database errors
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  private async generateUniqueUserId(): Promise<number> {
    // Generate a unique user ID
    const lastUser = await this.userModel
      .findOne()
      .sort({ userId: -1 })
      .select('userId')
      .exec();

    const nextUserId = lastUser ? lastUser.userId + 1 : 1;
    return nextUserId;
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    // First, verify the user exists
    const userExists = await this.userModel.findOne({ userId }).exec();
    
    if (!userExists) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Find transactions for the specific user
    return this.transactionModel.find({ userId }).exec();
  }
}