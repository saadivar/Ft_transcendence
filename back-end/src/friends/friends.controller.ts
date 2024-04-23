import { Body, Controller, Get, Inject, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { JwtService } from '@nestjs/jwt';
import {Response,Request} from "express"
import { WebsocketService } from 'src/realtime/Websocketservice';
import { AuthService } from 'src/auth/auth.service';
import { ChatService } from 'src/chat/chat.service';
import { User } from 'src/typeorm/entities/User';
import { jwtguard } from 'src/guards/jwtguqrd';

@UseGuards(jwtguard)
@Controller('friends')
export class FriendsController {

    constructor(private readonly friendsservice: FriendsService,
    private jwtService: JwtService,private readonly websocketService: WebsocketService,private readonly authservice: AuthService,
    private readonly chatService: ChatService){
    }

    @Post('sendrequest')
    async accept(@Req() req:Request,@Res() res:Response, @Body() body: any)
    {
        const users = req.user as User;
        const user = await this.authservice.findUserbylogin(body['login']);
        if(!user)
        {
          this.websocketService.emiterrorToUser(users.id.toString(),`${body["login"]} not found`);
          return ;
        }
      
        const response = await this.friendsservice.confirmfriendship({user1:user,user2:users})
        if(response == "")
        {
          this.websocketService.emiterrorToUser(users.id.toString(),`${body["login"]} error`);
          return ;
          

        }
        else if(response == "not")
        {
          this.websocketService.emiterrorToUser(users.id.toString(),`${body["login"]} not found`);
          return ;

        }
        else if(response == "me")
        {
          this.websocketService.emiterrorToUser(users.id.toString(),"cant add yoursel");
          return ;

        }
        else if (response == "blocked")
        {
          this.websocketService.emiterrorToUser(users.id.toString(),`${body["login"]} is blocked`);
          return ;

        }
        await this.authservice.createnotif({type:"pending",user:user,sender:users,room:null,isReaded:false});
        this.websocketService.emitToUser(
            user.id.toString(),
            'friendRequestReceived',
          );
        this.websocketService.emitToUser(
          users.id.toString(),
          'friendRequestReceived',
        );
        this.websocketService.emitnotifToUser(
          user.id.toString(),
          'notif',"pending","1"
        );
          
        return res.status(200).send("ok");
        
        
    }
    @Get('notaccepted')
    async getAllUsers(@Req() req,@Res() res) {
        const user =  req.user;
        const us = await this.friendsservice.findAllfriends(user);
        const b = JSON.stringify(us);
        return res.send(b);
      }
      @Get('isaccepted')
      async isaccepted(@Req() req:Request,@Res() res) {
    
        const user = req.user as User;
        const us = await this.friendsservice.findAllacceotedfriends(user);
        const b = JSON.stringify(us);
        return res.send(b);
      }
      @Post('acceptrequest')
    async acceptfriends(@Req() req:Request,@Body() body: { id: number })
    {
         
        const user = req.user as User;
        const friendId = body.id;
        const user1 = await this.authservice.findUser(friendId);
        const result = await this.friendsservice.acceptFriend(user,user1);
        const chat = await this.chatService.newchat({friends:result,rooms:null});
        result.chat = chat;
        this.friendsservice.updatechatfriends(result);
        this.websocketService.emitToUser(
            user1.id.toString(),
            'friendRequestReceived',
          );
          this.websocketService.emitToUser(
            user.id.toString(),
            'friendRequestReceived',
          );
        
    }
    @Post('rejectrequest')
    async rejectfriend(@Req() req:Request,@Res() res,@Body() body: { id: number })
    {
         
        const user = req.user as User;
        const friendId = body.id;
        const user1 = await this.authservice.findUser(friendId);
        const friendship = await this.friendsservice.findfriendship({user1:user,user2:user1})
        const deleted = await this.friendsservice.deletefriendship(friendship);
        this.websocketService.emitToUser(
          user.id.toString(),
          'friendRequestReceived',
        );
        res.send("ok");
        
        
    }
    ////blockercontroller
    @Get('blockedlist')
    async blockedlist(@Req() req,@Res() res) {
        
        const user = req.user as User;
        const us = await this.friendsservice.findallblocked(user);
        const b = JSON.stringify(us);
        return res.send(b);
      }
      @Post("block")
      async blockfriend(@Req() req:Request,@Res() res:Response,@Body() body: { id: number })
      {
          const user11 = req.user as User;
          const friendId = body.id;
          const user22 = await this.authservice.findUser(friendId);
          const friendship = await this.friendsservice.findfriendship({user1:user11,user2:user22})
          const deleted = await this.friendsservice.deletefriendship(friendship);
          await this.friendsservice.blocking({user1:user11,user2:user22});
          this.authservice.updatenotification("message",user22,user11.id);
          this.websocketService.emitToUser(user22.id.toString(),"refreshNotifs");
          
          this.websocketService.emitToUser(
            user22.id.toString(),
            'block',
          );
          this.websocketService.emitToUser(
            user11.id.toString(),
            'block',
          );
          res.send("ok");
      }
      @Post("unfriend")
      async unfriend(@Req() req:Request,@Res() res:Response,@Body() body: { id: number })
      {
          const user11 = req.user as User;
          const friendId = body.id;
          const user22 = await this.authservice.findUser(friendId);
          const friendship = await this.friendsservice.findfriendship({user1:user11,user2:user22})
          const deleted = await this.friendsservice.deletefriendship(friendship);
          this.authservice.updatenotification("message",user22,user11.id);
          this.websocketService.emitToUser(user22.id.toString(),"refreshNotifs");
          this.websocketService.emitToUser(
              user22.id.toString(),
              'friendRequestReceived',
            ); 
            this.websocketService.emitToUser(
              user11.id.toString(),
              'friendRequestReceived',
            ); 

          res.send("ok");
      }
      @Post("unblock")
    async unblockfriend(@Req() req:Request,@Res() res:Response,@Body() body: { id: number })
    {
        
        const user11 = req.user as User;
        const friendId = body.id;
        const user22 = await this.authservice.findUser(friendId);
        const blocked = await this.friendsservice.findblocked({user1:user11,user2:user22})
        const deleted = await this.friendsservice.deleteblockedrow(blocked);
        res.send("ok");
    }
}
