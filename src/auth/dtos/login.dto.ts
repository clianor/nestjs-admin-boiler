import { ApiProperty, PickType } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

import { User } from 'src/user/entities/user.entity';

export class LoginDto extends PickType(User, ['email'] as const) {
  @ApiProperty({ type: String, description: '유저 패스워드' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
