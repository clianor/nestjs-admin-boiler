import { Injectable, InternalServerErrorException, NestMiddleware } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';

import { UserService } from 'src/user/user.service';

import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      if ('authorization' in req.headers) {
        const decoded = this.authService.decodeToken(req.headers?.authorization);

        if (typeof decoded === 'object' && decoded.email !== undefined) {
          req['user'] = await this.userService.findById(decoded.id);
        }
      } else {
        req['user'] = null;
      }

      next();
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }
}
