import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get(':userId/transactions')
  async getUserTransactions(@Param('userId') userId: number) {
    return this.usersService.getUserTransactions(userId);
  }
}
