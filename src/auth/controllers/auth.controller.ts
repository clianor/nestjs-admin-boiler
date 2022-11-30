import { Body, Controller, Get, Post, Res, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Response } from 'express';

import { Serialize } from 'src/common/decorators/serialize.decorator';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

import { GetUser } from '../decorators/get-user.decorator';
import { LoginDto, LoginOutputDto } from '../dtos/login.dto';
import { MeOutputDto } from '../dtos/me.dto';
import { RegisterDto, RegisterOutputDto } from '../dtos/register.dto';
import { JwtAuthenticationGuard } from '../guards/jwt-authentication.guard';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '회원가입 API',
  })
  @Serialize(RegisterOutputDto)
  @Post('register')
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() createUserDto: RegisterDto,
  ): Promise<RegisterOutputDto> {
    const result = await this.authService.register(createUserDto);
    res.status(result.statusCode);
    return result;
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: '로그인 API',
  })
  @Serialize(LoginOutputDto)
  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDto,
  ): Promise<LoginOutputDto> {
    const result = await this.authService.login(loginDto);
    res.status(result.statusCode);
    return result;
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: '로그아웃',
  })
  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  async logout(@GetUser() user: User, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(user);
    res.status(HttpStatus.NO_CONTENT);
    return null;
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: HttpStatus.OK,
    description: '내정보',
  })
  @UseGuards(JwtAuthenticationGuard)
  @Serialize(MeOutputDto)
  @Get('me')
  async me(@Res({ passthrough: true }) res: Response, @GetUser() user: User): Promise<MeOutputDto> {
    const result: MeOutputDto = { statusCode: HttpStatus.OK, data: user };
    res.status(result.statusCode);
    return result;
  }
}
