import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Response } from 'express';

import { User } from 'src/user/entities/user.entity';

import { GetUser } from '../decorators/get-user.decorator';
import { TwoFactorDto } from '../dtos/two-factor.dto';
import { JwtTwoFactorGuard } from '../guards/jwt-two-factor.guard';
import { TwoFactorAuthService } from '../services/two-factor-auth.service';

@ApiTags('Auth')
@Controller('auth/2fa')
export class TwoFactorAuthController {
  constructor(private readonly twoFactorAuthService: TwoFactorAuthService) {}

  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'QR 이미지 생성',
  })
  @UseGuards(JwtTwoFactorGuard)
  @Post('generate-qr')
  async generateQrCode(@GetUser() user: User, @Res() res: Response) {
    const { otpAuthUrl } = await this.twoFactorAuthService.generateTwoFactorAuthSecret(user);
    res.setHeader('content-type', 'image/png');
    res.status(HttpStatus.OK);
    return this.twoFactorAuthService.qrCodeStreamPipe(res, otpAuthUrl);
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: HttpStatus.OK,
    description: '2fa 인증 로그인',
  })
  @UseGuards(JwtTwoFactorGuard)
  @Post('authenticate')
  async authenticate(
    @GetUser() user: User,
    @Body() twoFactorDto: TwoFactorDto,
    @Res() res: Response,
  ) {
    const isCodeValid = this.twoFactorAuthService.verifyTwoFaCode(twoFactorDto.code, user);
    if (!isCodeValid) {
      throw new UnauthorizedException('잘못된 OTP 인증 코드입니다.');
    }

    const result = await this.twoFactorAuthService.login(user, true);
    res.status(result.statusCode);
    return result;
  }
}
