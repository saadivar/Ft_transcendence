


import { Socket } from "socket.io";
import { Client } from "socket.io/dist/client";
import { wsjwtguard } from "../guards/wsjwtguard";
import { JwtService } from "@nestjs/jwt";
import { error, log } from "console";
import { UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";

export type Socketiomiddlware = {
    (client:Socket,next:(err?:Error)=>void);
}

export const socketmidd = (jwtservice:JwtService,authservice:AuthService):Socketiomiddlware => {

     return async (client,next)=>
    { 
        try{
            let cookie = client.handshake.headers.cookie;
            if(!cookie)
                throw new UnauthorizedException();
            cookie = cookie.substring(4);
            const data = await jwtservice.verifyAsync(cookie);
            if(!data)
                throw new UnauthorizedException();
            client.data.user = await authservice.findUser(data['id']);
            
            
            next();
        }
        catch 
        {
            next(new UnauthorizedException());
        }
    }  

}