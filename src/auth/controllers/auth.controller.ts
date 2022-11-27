import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { User } from 'src/user/entities/user.entity';

import { LoginDto } from '../dtos/login.dto';
import { JwtAuthenticationGuard } from '../guards/jwt-authentication.guard';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 201,
    description: '회원가입 API',
  })
  @Post('register')
  @HttpCode(201)
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string; refreshToken?: string }> {
    return await this.authService.login(loginDto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  @HttpCode(200)
  async logout(): Promise<void> {
    return null;
  }
}
