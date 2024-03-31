
import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { User } from 'src/typeorm/entities/User';
import { toFileStream } from 'qrcode';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
@Injectable()
export class TwoFactorAuthenticationService {
  constructor (
    private readonly authservice: AuthService,
  ) {}
 
  public async generateTwoFactorAuthenticationSecret(user: User) {
    

    const secret = authenticator.generateSecret();
 
    const otpauthUrl = authenticator.keyuri(user.email, "pingponggame", secret);
 
    await this.authservice.setTwoFactorAuthenticationSecret(secret, user.id);
 
    return {
      secret,
      otpauthUrl
    }
  }
  public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }
  public isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User) {
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.twoFactorAuthenticationSecret
    })
  }
  
}