import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "../auth/auth.service";
import { JwtService } from "@nestjs/jwt";
import {Response,Request} from "express"
import { Socket } from "socket.io";

@Injectable()
export class wsjwtguard implements CanActivate
{
    constructor( private readonly authService: AuthService,
        private jwtservice: JwtService){}
        async canActivate(context: ExecutionContext) {
        if(context.getType() !== "ws")
            return true;
        const client = context.switchToWs().getClient<Socket>();
        let cookie = client.handshake.headers.cookie;
        if(!cookie)
            throw new UnauthorizedException();
        cookie = cookie.substring(4);
        const data = await this.jwtservice.verifyAsync(cookie);
        if(!data)
            throw new UnauthorizedException();
       return true;
    }
}