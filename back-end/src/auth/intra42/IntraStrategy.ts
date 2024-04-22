
import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy,Profile} from 'passport-42';
import { AuthService } from "../auth.service";
@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy)
{
    constructor( private readonly authService: AuthService ){
        super({
            clientID:`${process.env.Clientid}`,
            clientSecret:`${process.env.ClientSecret}`,
            callbackURL:`${process.env.url_back}/api/auth/42/redirect`,
            Scope:['profile'],
        });
    }
    async validate(accessToken: string,refreshToken: string,profile: Profile)
    {
        
        const user = await this.authService.validateUser({
            login : profile.username,email: profile.emails[0].value,avatar:profile._json.image.link});
        return user;
    } 
} 