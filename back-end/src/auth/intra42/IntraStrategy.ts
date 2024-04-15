
import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy,Profile} from 'passport-42';
import { AuthService } from "../auth.service";
@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy)
{
    constructor( private readonly authService: AuthService ){
        super({
            clientID:"u-s4t2ud-45f7a4b2d6c78e98eaaa98dbbb2ab728319b88fd53639b970070ddb86860d773",
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