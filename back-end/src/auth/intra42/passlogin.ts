import { CanActivate, ExecutionContext, HttpException, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { JwtService } from "@nestjs/jwt";
import {Response,Request, response} from "express"

@Injectable()
export class passlogin implements CanActivate
{
    constructor( private readonly authService: AuthService,
        private jwtService: JwtService){}
        async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest<Request>();
        const res = context.switchToHttp().getResponse<Response>();
        const cookie = req.cookies['jwt'];
        if(!cookie)
          return true;
        try {
            const data = await this.jwtService.verifyAsync(cookie);
            if(!data)
              return true;
            const user = await this.authService.findUser(data['id']);
            
            if(!user)
              return true;
            req.user = user;
            if(user.HasAccess == false)
            {
              res.redirect(`${process.env.url_front}/2fa`);
              return false;
            }
            res.redirect(`${process.env.url_front}/Home`);
            return false;
          } catch  {
                return true;
        }
       
    }

}