export interface PortfolioResponseDto {
  balance: number;
  totalInvestment: number;
  portfolioItems: {
    metal: string;
    symbol: string;
    investmentAmount: number;
    allocationPercentage: number;
    rate: number;
    weight: number;
    lastUpdatedAt: Date;
  }[];
}