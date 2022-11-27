import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

import { LoginDto } from '../dtos/login.dto';
import { JwtPayload } from '../interface/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  decodeToken(token: string): JwtPayload {
    return this.jwtService.decode(token.replace(/^Bearer\s/, '')) as JwtPayload;
  }

  getAccessToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`,
    });
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify(token.replace(/^Bearer\s/, ''), {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      });
    } catch {
      throw new UnauthorizedException();
    }
  }

  getRefreshToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`,
    });
  }

  verifyRefreshToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify(token.replace(/^Bearer\s/, ''), {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      });
    } catch {
      throw new UnauthorizedException();
    }
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userService.findOne(createUserDto.email);
    if (user) throw new ConflictException('이미 존재하는 유저입니다.');
    return await this.userService.create(createUserDto);
  }

  async login({
    email,
    password,
  }: LoginDto): Promise<{ accessToken: string; refreshToken?: string }> {
    const user = await this.userService.findOne(email);
    if (!user) throw new NotFoundException('존재하지 않는 유저입니다.');

    const compare = await user.checkPassword(password);
    if (!compare) throw new BadRequestException('잘못된 패스워드입니다.');

    const payload: JwtPayload = {
      isTwoFaAuthenticated: !user.isTwoFactorEnable,
      isTwoFactorEnable: user.isTwoFactorEnable,
      id: user.id,
      email: user.email,
      name: user.name,
    };

    const accessToken = this.getAccessToken(payload);

    if (user.isTwoFactorEnable) {
      return {
        accessToken,
      };
    }

    const refreshToken = this.getRefreshToken(payload);

    await this.userRepository.update({ id: user.id }, { refreshToken });

    return {
      accessToken,
      refreshToken,
    };
  }
}
