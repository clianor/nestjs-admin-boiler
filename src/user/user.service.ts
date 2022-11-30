import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  create({ name, email, password }: CreateUserDto): Promise<User> {
    const user = new User();
    user.name = name;
    user.email = email;
    user.password = password;
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  findById(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async removeById(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
