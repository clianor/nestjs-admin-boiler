import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Response } from 'express';

import { GetUser } from '../decorators/get-user.decorator';
import { TwoFactorDto } from '../dtos/two-factor.dto';
import { JwtTwoFactorGuard } from '../guards/jwt-two-factor.guard';
import { TwoFactorAuthService } from '../services/two-factor-auth.service';

@ApiTags('Auth')
@Controller('auth/2fa')
export class TwoFactorAuthController {
  constructor(private readonly twoFactorAuthService: TwoFactorAuthService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtTwoFactorGuard)
  @Post('generate-qr')
  @HttpCode(200)
  async generateQrCode(@GetUser() user, @Res() response: Response) {
    const { otpAuthUrl } = await this.twoFactorAuthService.generateTwoFactorAuthSecret(user);
    response.setHeader('content-type', 'image/png');
    return this.twoFactorAuthService.qrCodeStreamPipe(response, otpAuthUrl);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtTwoFactorGuard)
  @Post('authenticate')
  @HttpCode(200)
  async authenticate(@GetUser() user, @Body() twoFactorDto: TwoFactorDto) {
    const isValid = this.twoFactorAuthService.verify(twoFactorDto.code, user);
    if (!isValid) {
      throw new UnauthorizedException('잘못된 인증 코드입니다.');
    }
    return this.twoFactorAuthService.login(user, true);
  }
}
