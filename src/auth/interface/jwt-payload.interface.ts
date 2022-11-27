import { User } from 'src/user/entities/user.entity';

export interface JwtPayload extends Pick<User, 'id' | 'name' | 'email'> {
  isTwoFactorEnable: boolean;
  isTwoFaAuthenticated: boolean;
}
