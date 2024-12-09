import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://swapnil:swapnil@swapnil.wfwy9.mongodb.net/Alchemist?retryWrites=true&w=majority', {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    }),
    UsersModule,
    PortfolioModule,
    SharedModule,
    AuthModule
  ],
})
export class AppModule {}
