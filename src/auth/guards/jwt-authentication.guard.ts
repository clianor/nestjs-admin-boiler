import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Observable } from 'rxjs';

import { User } from 'src/user/entities/user.entity';

import { AuthService } from '../services/auth.service';

/**
 *  JWT 가드 ( access-token 검증 )
 */
@Injectable()
export class JwtAuthenticationGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    const payload = this.authService.verifyAccessToken(request.headers?.authorization);
    if (!payload.isTwoFaAuthenticated) return false;
    if (!user) return true;
    return true;
  }
}
