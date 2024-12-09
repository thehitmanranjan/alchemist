import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from '../auth/jwtAuthGuard';
import { PortfolioResponseDto } from './dto/profile-response.dto';

// @UseGuards(JwtAuthGuard)
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post('buy')
  async buyMetal(@Body() CreateTransactionDto: CreateTransactionDto) {
    return this.portfolioService.buyMetal(CreateTransactionDto);
  }

  @Post('sell')
  async sellMetal(@Body() CreateTransactionDto: CreateTransactionDto) {
    return this.portfolioService.sellMetal(CreateTransactionDto);
  }

  @Get(':userId')
  async getUserPortfolio(@Param('userId') userId: string): Promise<PortfolioResponseDto> {
    return this.portfolioService.getUserPortfolio(parseInt(userId));
  }
}
