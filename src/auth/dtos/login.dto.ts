import { PickType } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { CoreOutputDto } from 'src/common/core-output.dt';
import { User } from 'src/user/entities/user.entity';

export class LoginDto extends PickType(User, ['email', 'password'] as const) {}

export class LoginOutputDto extends CoreOutputDto {
  @Expose()
  data?: {
    accessToken: string;
    refreshToken?: string;
  };
}
