import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Observable } from 'rxjs';

import { User } from 'src/user/entities/user.entity';

import { AuthService } from '../services/auth.service';

/**
 * Refresh JWT 가드 ( refresh-token 검증 )
 */
@Injectable()
export class JwtRefreshTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    const payload = this.authService.verifyRefreshToken(request.headers?.authorization);
    if (!payload.isTwoFaAuthenticated) return false;
    if (!user) return true;
    return true;
  }
}
