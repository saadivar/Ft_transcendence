import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { jwtguard } from 'src/guards/jwtguqrd';
import { WebsocketService } from 'src/realtime/Websocketservice';
import { GameService } from './game.service';
import { User } from 'src/typeorm/entities/User';
import {Response,Request} from "express"

@UseGuards(jwtguard)
@Controller('game')
export class GameController {
    constructor(
        private readonly gamesarvice:GameService,
        ){}
    @Get("matchhistory")
    async matchhistory(@Req() req:Request,@Res() res:Response){
        const user = req.user as User;
        const games  = this.gamesarvice.findgames(user);
    }   
    
}
