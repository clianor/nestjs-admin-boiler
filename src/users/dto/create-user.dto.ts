import { PickType } from '@nestjs/mapped-types';

import { IsString } from 'class-validator';

import { User } from '../entities/users.entity';

export class CreateUserDto extends PickType(User, ['email', 'name'] as const) {
  @IsString()
  password: string;
}
