import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Response } from 'express';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { Repository } from 'typeorm';

import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

import { LoginOutputDto } from '../dtos/login.dto';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { AuthService } from './auth.service';

@Injectable()
export class TwoFactorAuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async generateTwoFactorAuthSecret(user: User) {
    const auth = await this.userService.findByEmail(user.email);
    if (!auth || !auth.isTwoFactorEnable) {
      throw new ForbiddenException('Two Factor 권한이 없습니다.');
    }

    const secret = authenticator.generateSecret();
    const issuer = 'alyac';
    const otpAuthUrl = authenticator.keyuri(user.email, issuer, secret);
    await this.userRepository.update({ id: user.id }, { twoFactorAuthSecret: secret });
    return {
      secret,
      otpAuthUrl,
    };
  }

  async qrCodeStreamPipe(stream: Response, otpPathUrl: string) {
    return toFileStream(stream, otpPathUrl);
  }

  verifyTwoFaCode(code: string, user: User): boolean {
    return authenticator.verify({ token: code, secret: user.twoFactorAuthSecret });
  }

  async login(user: User, isTwoFaAuthenticated: boolean): Promise<LoginOutputDto> {
    const payload: JwtPayload = {
      isTwoFaAuthenticated,
      isTwoFactorEnable: user.isTwoFactorEnable,
      id: user.id,
      email: user.email,
      name: user.name,
    };

    const accessToken = this.authService.getAccessToken(payload);
    const refreshToken = this.authService.getRefreshToken(payload);

    await this.userRepository.update({ id: user.id }, { refreshToken });

    return {
      statusCode: HttpStatus.OK,
      data: {
        accessToken,
        refreshToken,
      },
    };
  }
}
