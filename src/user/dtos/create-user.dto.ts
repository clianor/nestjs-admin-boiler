import { ApiProperty, PickType } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

import { User } from '../entities/user.entity';

export class CreateUserDto extends PickType(User, ['email', 'name'] as const) {
  @ApiProperty({ type: String, description: '유저 패스워드' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
