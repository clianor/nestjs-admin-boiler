import { Exclude, Expose, Type } from 'class-transformer';

import { CoreOutputDto } from 'src/common/core-output.dt';
import { User } from 'src/user/entities/user.entity';

export class MeOutputDto extends CoreOutputDto {
  @Expose()
  data?: User;
}
