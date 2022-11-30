import { Expose, Type } from 'class-transformer';

import { CoreOutputDto } from 'src/common/core-output.dt';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { User } from 'src/user/entities/user.entity';

export class RegisterDto extends CreateUserDto {}

export class RegisterOutputDto extends CoreOutputDto {
  @Expose()
  @Type(() => User)
  data?: User;
}
