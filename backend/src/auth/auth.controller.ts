import { Body, Controller, Get, Post } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { DataStoreService } from '../common/data-store.service';
import { RequestUserId } from '../common/request-user';

class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly store: DataStoreService) {}

  @Post('login')
  login(@Body() body: LoginDto) {
    const user = this.store.loginByEmail(body.email, body.password);
    return { user };
  }

  @Get('me')
  me(@RequestUserId() userId: number) {
    const user = this.store.getUser(userId);
    return { user };
  }

  @Get('users')
  users() {
    return { users: this.store.getUsers() };
  }
}
