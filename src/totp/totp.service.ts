import { Injectable } from '@nestjs/common';

import { authenticator, totp } from 'otplib';

@Injectable()
export class TotpService {
  private resetOptions() {
    totp.resetOptions();
    totp.options = {
      epoch: Date.now(),
      step: 30,
      window: 0,
    };
  }

  generateSecret(): string {
    return authenticator.generateSecret();
  }

  createToken(key: string): string {
    this.resetOptions();
    return totp.generate(key);
  }

  checkToken(key: string, token: string): boolean {
    this.resetOptions();
    return totp.check(token, key);
  }
}
