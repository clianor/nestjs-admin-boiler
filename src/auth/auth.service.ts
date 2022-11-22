import { ConflictException, Injectable } from '@nestjs/common';

import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const exists = await this.usersService.findOne(createUserDto.email);
    if (exists) throw new ConflictException('이미 존재하는 유저입니다');
    return await this.usersService.create(createUserDto);
  }
}
