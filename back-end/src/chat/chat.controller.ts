import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {Response,Request} from "express"
import { AuthService } from 'src/auth/auth.service';
import { WebsocketService } from 'src/realtime/Websocketservice';
import { ChatService } from './chat.service';
import { FriendsService } from 'src/friends/friends.service';
import { RoomService } from 'src/room/room.service';
import { jwtguard } from 'src/guards/jwtguqrd';
import { User } from 'src/typeorm/entities/User';

@UseGuards(jwtguard)
@Controller('chat')
export class ChatController {


    constructor( private readonly authService: AuthService,
        private jwtService: JwtService,private readonly websocketService: WebsocketService,
        private readonly chatService : ChatService,private readonly friendsService : FriendsService,
        private readonly roomService : RoomService){
        }
    @Post('getconversation')
    async getconversation(@Req() req:Request,@Res() res:Response,@Body() body: { id: number })
     {
        
        try{
            
            const user11 = req.user as User;
            const friendId = body.id;
            const user22 = await this.authService.findUser(friendId);
            const friendship = await this.friendsService.findfriendship({user1:user11,user2:user22})
            const chat1 = await this.chatService.findChatByFriendshipId({friends:friendship,rooms:null});
            const messages = await this.chatService.findMessagesByChatId(chat1.id);
            const simplifiedMessages = [];

                for (let i = 0; i < messages.length; i++) {
                const message = messages[i];
                const use = await this.authService.findUser(message.sender.id);
                const simplifiedMessage = {
                    content: message.content,
                    sender: use.login,
                    senderId: use.id,
                    senderavatar:use.avatar,
                };
                simplifiedMessages.push(simplifiedMessage);
            }

            res.send(simplifiedMessages);
            
        } 
        catch
        {
            throw new UnauthorizedException();
        }
            
    }
    @Post('getroomconversation')
    async getroomconversation(@Req() req:Request,@Res() res:Response,@Body() body: { roomname: string }) {
        try{
            
            const user11 = req.user as User;
            const roomname = body.roomname;
            const room = await this.roomService.findroom(roomname);
            const userexist = await this.roomService.userExistInRoom(room,user11);
            if(!userexist)
                throw new UnauthorizedException();
            const chat1 = await this.chatService.findChatByroomid({friends:null,rooms:room});
            const messages = await this.chatService.findMessagesByChatId(chat1.id);
            
            const simplifiedMessages = [];

                for (let i = 0; i < messages.length; i++) {
                    const message = messages[i];
                    const use = await this.authService.findUser(message.sender.id);
                    const otheruserblocked = await this.friendsService.findallblocked(use);
                    const usersblockedbyme = await this.friendsService.findallblocked(user11);
                    const idExists = otheruserblocked.some(obj => obj.id === user11.id);
                    const idExists1 = usersblockedbyme.some(obj => obj.id === use.id);
                    if(!idExists && !idExists1)
                    {
                        const simplifiedMessage = {
                            content: message.content,
                            senderId: use.id,
                            senderavatar:use.avatar,
                        };
                        simplifiedMessages.push(simplifiedMessage);
                    }
                
            }
            
            res.send(simplifiedMessages); 
            
        } 
        catch
        {
            throw new UnauthorizedException();
        }
            
    }
    @Get('notifications')
    async genotifications(@Req() req:Request,@Res() res:Response)
    {
        const user= req.user as User;
        const noti =  await this.authService.getnotifications(user);
        res.send(noti)
    }
    
}
