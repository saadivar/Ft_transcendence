import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class IntraAuthGuard extends AuthGuard('42')
{
    async canActivate(context: ExecutionContext) {
        const activate = (await super.canActivate(context)) as boolean;
        if (activate)
            return (activate) ;
        const request = context.switchToHttp().getRequest();
        await super.logIn(request);
        return activate;
    }

}


