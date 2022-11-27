import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Observable } from 'rxjs';

import { User } from 'src/user/entities/user.entity';

import { AuthService } from '../services/auth.service';

/**
 * Two-Factor JWT 가드 ( access-token 검증 )
 */
@Injectable()
export class JwtTwoFactorGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    const payload = this.authService.verifyAccessToken(request.headers?.authorization);

    if (!user) return false;
    if (!payload.isTwoFactorEnable) return false;
    if (payload.isTwoFaAuthenticated) return false;
    return true;
  }
}
