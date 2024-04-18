import {
    ClassSerializerInterceptor,
    Controller,
    Header,
    Post,
    UseInterceptors,
    Res,Body,
    UseGuards,
    Req,
    HttpCode,
    UnauthorizedException,
    Get,
  } from '@nestjs/common';
  import { Response,Request } from 'express';


import { User } from 'src/typeorm/entities/User';

import { JwtService } from '@nestjs/jwt';
import { TwoFactorAuthenticationService } from './2fa.service';
import { jwtguard } from 'src/guards/jwtguqrd';
import { AuthService } from 'src/auth/auth.service';
import { WebsocketService } from 'src/realtime/Websocketservice';
   
  
  @Controller('2fa')
  export class TwoFactorAuthenticationController {
    constructor(
      private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,private readonly authService: AuthService,private jwtService: JwtService,private readonly websocketService: WebsocketService
    ) {}
    @UseGuards(jwtguard)
    @Get('generate')
    async register(@Res() response: Response, @Req() request: Request) {
        const user = request.user as User;
      const { otpauthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(user);
        
      return this.twoFactorAuthenticationService.pipeQrCodeStream(response, otpauthUrl);
    }
    @UseGuards(jwtguard)
    @Post('turn-on')
    @HttpCode(200)
    async turnOnTwoFactorAuthentication(
    @Req() request: Request,
    @Body() body :{twofa  : string}
  ) {
    
      const user = request.user as User;

    const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        body.twofa, user
      );
      if (!isCodeValid) {
        
        this.websocketService.emiterrorToUser(user.id.toString(),"Wrong authentication code")
        return;
      }
    await this.authService.turnOnTwoFactorAuthentication(user.id);
    this.websocketService.emitToUser(user.id.toString(),"updated");

    
  }
  @UseGuards(jwtguard)
    @Post('turn-off')
    @HttpCode(200)
    async turnOffTwoFactorAuthentication(
    @Req() request: Request,
    @Body() body :{twofa  : string}
  ) {
    
      const user = request.user as User;
    const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        body.twofa, user
      );
      if (!isCodeValid) {
        this.websocketService.emiterrorToUser(user.id.toString(),"Wrong authentication code")
        return;

      }
    await this.authService.turnOffTwoFactorAuthentication(user.id);
    this.websocketService.emitToUser(user.id.toString(),"updated");

    
  }

  @Post('authenticate')
  @HttpCode(200)
  async authenticate(
    @Req() request: Request,@Res() res:Response,
    @Body()  body: {twofa  : string}
  ) {
    const cookie = request.cookies['jwt']; 
    if(!cookie)
        throw new UnauthorizedException();
    const data = await this.jwtService.verifyAsync(cookie);
    if(!data)
    { 
        throw new UnauthorizedException();
    }
    const user = await this.authService.findUser(data['id']);
    const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        body.twofa, user
    );
    if (!isCodeValid) {
      this.websocketService.emiterrorToUser(user.id.toString(),"Wrong authentication code")
      return;
    }
    user.HasAccess = true; 
    await this.authService.update(user);
    res.status(200).send("OK");
    return ;
  }

}