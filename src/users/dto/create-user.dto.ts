import { ApiProperty, PickType } from '@nestjs/swagger';

import { IsString } from 'class-validator';

import { User } from '../entities/users.entity';

export class CreateUserDto extends PickType(User, ['email', 'name'] as const) {
  @ApiProperty()
  @IsString()
  password: string;
}
