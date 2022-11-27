import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TotpModule } from 'src/totp/totp.module';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';

import { AuthController } from './controllers/auth.controller';
import { TwoFactorAuthController } from './controllers/two-factor-auth.controller';
import { AuthService } from './services/auth.service';
import { TwoFactorAuthService } from './services/two-factor-auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigModule, TotpModule, UserModule],
  controllers: [AuthController, TwoFactorAuthController],
  providers: [AuthService, TwoFactorAuthService, JwtService],
  exports: [AuthService, TwoFactorAuthService, JwtService],
})
export class AuthModule {}
