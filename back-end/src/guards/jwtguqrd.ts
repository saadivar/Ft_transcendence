import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "../auth/auth.service";
import { JwtService } from "@nestjs/jwt";
import {Response,Request} from "express"

@Injectable()
export class jwtguard implements CanActivate
{
    constructor( private readonly authService: AuthService,
        private jwtService: JwtService){}
        async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest<Request>();
        const res = context.switchToHttp().getResponse<Response>();
       const cookie = req.cookies['jwt'];
       if(!cookie)
           return false;
       const data = await this.jwtService.verifyAsync(cookie);
       if(!data)
       { 
            return false;
       }
       const user = await this.authService.findUser(data['id']);
       req.user = user;
       return true;
    } 

}