import { Body, Controller, Get, Param, Post, Req, Res, UnauthorizedException, UseGuards, ValidationPipe } from '@nestjs/common';
import { Response, Request } from "express"
import { RoomMember } from 'src/typeorm/entities/RoomMember';
import { RoomService } from './room.service';
import { JwtService } from '@nestjs/jwt';
import { WebsocketService } from 'src/realtime/Websocketservice';
import { AuthService } from 'src/auth/auth.service';
import { ChatService } from 'src/chat/chat.service';
import { User } from 'src/typeorm/entities/User';
import { jwtguard } from 'src/guards/jwtguqrd';
import { CreateRoomDto } from './createroomdto';

@UseGuards(jwtguard)
@Controller('room')
export class RoomController {
    constructor(private readonly roomservice: RoomService,
        private jwtService: JwtService, private readonly websocketService: WebsocketService, private readonly authService: AuthService, private readonly chatService: ChatService) {
    }

    @Get('listjoinedrooms')
    async listjoinedrooms(@Req() req, @Res() res) {

        const user = req.user as User;
        const us = await this.roomservice.findPublicRoomsJoined(user);
        const b = JSON.stringify(us);
        
        return res.send(b);
    }
    @Get('listnotjoinedrooms')
    async roomlist(@Req() req, @Res() res) {

        const user = req.user as User;
        const us = await this.roomservice.findPublicRoomsNotJoined(user);
        const b =  JSON.stringify(us);
        return res.send(b);
    }
    @Post("createroom")
    async firstrom(@Req() req, @Res() res, @Body(ValidationPipe) createroomdto: CreateRoomDto) {
        const user = req.user as User;
        if (createroomdto.type === "protected") {
            if (createroomdto.password !== "")
            {
                createroomdto.password = await this.roomservice.hashPassword(req.body.password);
            }
            else
                throw new UnauthorizedException();
        }
        const myroom = await this.roomservice.createroom(createroomdto, user);
        if (!myroom)
            throw new UnauthorizedException();
        const roomMember = new RoomMember();
        roomMember.user = user; 
        roomMember.room = myroom;
        roomMember.role = "owner";
        const member = await this.roomservice.createmember(roomMember);
        const chat = await this.chatService.newchat({ friends: null, rooms: myroom });

        myroom.chat = chat;
        this.roomservice.updatechatroom(myroom);
        
        res.send("ok");

    }
    // @Post("userjoinroom")
    // async userjoinroom(@Req() req: Request, @Res() res: Response, @Body() body: { name: string, password: string }) {

    //     const user11 = req.user as User;
    //     const roomname = body.name;
    //     const room = await this.roomservice.findroom(roomname);

    //     if (room.type == "protected") {
    //         const check = await this.roomservice.comparePasswords(body.password, room.password)
    //         if (!check) {
    //             res.send({ "login": room.roomname, "cause": "password invalid" });
    //             return;
    //         }
    //     }
    //     const joining = await this.roomservice.joinusertoroom(room, user11);
    //     res.send("ok");
    // }
    
    
    @Post("unmuteuser")
    async unmuteuser(@Req() req: Request, @Res() res: Response, @Body() body: { id: number, name: string }) {
        const user11 = req.user as User;
        const usermuted = await this.authService.findUser(body.id);
        const roomname = body.name;
        const room = await this.roomservice.findroom(roomname);
        const user = await this.roomservice.unmuteuser(room, usermuted, user11);
        res.send("ok");
    }
    
    
    @Post("unbanuser")
    async unbanuser(@Req() req: Request, @Res() res: Response, @Body() body: { id: number, name: string }) {
        const user11 = req.user as User;
        const usermuted = await this.authService.findUser(body.id);
        const roomname = body.name;
        console.log(body.id ,body.name);
        const room = await this.roomservice.findroom(roomname);
        const user = await this.roomservice.unbanuser(room, usermuted, user11);
        await this.roomservice.leaveroom(roomname, usermuted);
        this.websocketService.emitToUser(usermuted.id.toString(),"newmember");
        this.websocketService.emitToUser(user11.id.toString(),"newmember");
        res.send("ok");
    }
    
    @Post("inviteforprivateroom")
    async inviteforprivateroom(@Req() req: Request, @Res() res: Response, @Body() body: { username: string, name: string }) {
        const user11 = req.user as User;
        const usertoinvite = await this.authService.findUserbylogin(body.username);
        const roomname = body.name;
        const room = await this.roomservice.findroom(roomname);
        const user = await this.roomservice.joinusertoroom(room, usertoinvite);
        this.websocketService.emitToUser(usertoinvite.id.toString(),"newmember");
        res.send("ok");
    }
    @Get('roomnotifications')
    async geroomnotifications(@Req() req:Request,@Res() res:Response)
    {
        const user= req.user as User;
        const noti =  await this.roomservice.getroomnotifications(user);
        res.send(noti)
    }
} 
