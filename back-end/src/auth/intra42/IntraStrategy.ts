
import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy,Profile} from 'passport-42';
import { AuthService } from "../auth.service";
@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy)
{
    constructor( private readonly authService: AuthService ){
        super({
            clientID:"u-s4t2ud-6fb49699746cb832bb650e4342095dfbc0e72de7afbf6057f2cc26fb90fc8373",
            clientSecret:"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",
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