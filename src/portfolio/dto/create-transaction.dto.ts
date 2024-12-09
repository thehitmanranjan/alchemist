export class CreateTransactionDto {
    userId: number;
    type: 'BUY' | 'SELL';
    amount: number;
  }
  