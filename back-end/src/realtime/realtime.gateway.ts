import { Inject, OnModuleInit, UnauthorizedException, UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { WebsocketService } from './Websocketservice';
import { AuthService } from 'src/auth/auth.service';
import { FriendsService } from 'src/friends/friends.service';
import { ChatService } from 'src/chat/chat.service';
import { RoomService } from 'src/room/room.service';
import { Console } from 'console';

import { JwtService } from '@nestjs/jwt';

import { User } from 'src/typeorm/entities/User';
import { socketmidd } from './socketmiddlware';
import { wsjwtguard } from 'src/guards/wsjwtguard';

@WebSocketGateway(
  {
    cors: "*",
  }
)
@UseGuards(wsjwtguard)
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  server;

  constructor(private readonly authService: AuthService, private readonly websocketService: WebsocketService, private readonly friendservice: FriendsService,
    private readonly chatService: ChatService, private readonly roomService: RoomService, private readonly jwtService: JwtService) { }
  afterInit(client: Socket) {
    client.use(socketmidd(this.jwtService, this.authService) as any)
  }
  async handleConnection(client: Socket) {
    if(client.data.user && this.websocketService.ifalreadyexist(client?.data?.user?.id,client))
    {

      client.disconnect();
      return;
    }
    if(client.data.user)
    {
      await this.authService.changestatus(client.data.user.id,"online");
      const user = await this.authService.findUser(client.data.user.id);
      this.websocketService.addUserToMap(client.data.user.id, client);
      const friends = await this.friendservice.findAllacceotedfriends(user);
      for(let i = 0; i < friends.length;i++)
      {
        this.websocketService.emitToUser(friends[i]?.id?.toString(),"friendRequestReceived");
      }
      client.join("brodcast");
    }
    
  }
  async handleDisconnect(client: Socket) {
    if(client.data.user)
    {
      this.websocketService.removeUserFromMap(client.data.user.id);
      await this.authService.changestatus(client.data.user.id, "offline");
      const user = await this.authService.findUser(client.data.user.id);
      const friends = await this.friendservice.findAllacceotedfriends(user);
      for(let i = 0; i < friends.length;i++)
        {
          this.websocketService.emitToUser(friends[i]?.id?.toString(),"friendRequestReceived");
        }

      client.leave("brodcast");
    }
    

  }
  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: { from: string; fromid: string; to: string; content: string }) {
    const user11 = await this.authService.findUser(Number(payload.fromid));
    const user22 = await this.authService.findUser(Number(payload.to));
    const friendship = await this.friendservice.findfriendship({ user1: user11, user2: user22 })
    if (!friendship || !user11 || !user22)
      return;
    const chat1 = await this.chatService.findChatByFriendshipId({ friends: friendship, rooms: null });
    if(payload.content == "" || payload.content.length > 100)
    {
      this.websocketService.emiterrorToUser(client.data.user.id,"message length");
      return;
    }
    const message = await this.chatService.createmessage({ content: payload.content, sendr: user11, chat: chat1 });
    await this.authService.createnotif({ type: "message", user: user22, sender: user11, room: null, isReaded: false });
    this.websocketService.emitmessgaetouser(client, payload)
  }

  @SubscribeMessage('roommessage')
  async handleroomMessage(client: Socket, payload: { fromid: string; roomname: string; content: string }) {
    const user11 = await this.authService.findUser(Number(payload.fromid));
    const room = await this.roomService.findroom(payload.roomname);
    const isallowedtosend = await this.roomService.getstatusofthemember(room, user11);
    if (isallowedtosend && isallowedtosend.status == null) {
      const chat1 = await this.chatService.findChatByroomid({ friends: null, rooms: room });
      if (payload.content !== "") {
        if(payload.content == "" || payload.content.length > 100)
          {
            this.websocketService.emiterrorToUser(client.data.user.id,"message length");
            return;
          }
          const message = await this.chatService.createmessage({ content: payload.content, sendr: user11, chat: chat1 });
        this.server.to(payload.roomname).emit('roomchat', payload.roomname);
        const memebers = await this.roomService.findroommembers(payload.roomname);
        for (let i = 0; i < memebers.members.length; i++) {
          const bool: Boolean = this.websocketService.checking(String(memebers.members[i].id), payload.roomname);
        
          const memberstatus = await this.roomService.getstatusofthemember(room,memebers.members[i]);
          if ((!memberstatus.status || memberstatus.status =="muted") && memebers.members[i].id == client.data.user.id || bool == true) {
            await this.authService.createnotif({ type: "roommessage", user: memebers.members[i], sender: user11, room: room, isReaded: true });

          }
          else if ((!memberstatus.status || memberstatus.status =="muted") && memebers.members[i].id != client.data.user.id) {
            await this.authService.createnotif({ type: "roommessage", user: memebers.members[i], sender: user11, room: room, isReaded: false });
            this.websocketService.emitToUser(String(memebers.members[i].id), "notifroommessage");
          }
        }
      } 

    }
  }

  @SubscribeMessage('notif')
  async handlenotif(client: Socket, payload: { type: string, senderid: number }) {
    const user = await this.authService.findUser(client.data.user.id);
    this.authService.updatenotification(payload.type, user, payload.senderid);
  }
  @SubscribeMessage('notifroom')
  async handlenotifroom(client: Socket, roomname: string) {
    const user = await this.authService.findUser(client.data.user.id);
    await this.roomService.updatenroomotification(user, roomname);
    this.websocketService.emitToUser(client.data.user.id, "notifroommessage");
  }
  @SubscribeMessage('invitegame')
  async invitegame(client: Socket, payload : { id: number}) {

    const user = await this.authService.findUser(client.data.user.id);
    const toplaywith = await this.authService.findUser(payload.id);
    if(toplaywith.status == "online")
      this.websocketService.emitgameToUser(payload.id.toString(), user);
    else if(toplaywith.status == "ingame")
      this.websocketService.emiterrorToUser(client.data.user.id, `${toplaywith.login} is already in game`);
    else
      this.websocketService.emiterrorToUser(client.data.user.id, `${toplaywith.login} is offline`);

  }
  @SubscribeMessage('newroom')
  async brodcastroom(client: Socket) {
    this.server.to("brodcast").emit('brodcast');
  }

  @SubscribeMessage('acceptGame')
  async acceptGame(client: Socket,id:string)
  {
    this.websocketService.emitgameacccepttouser(id,client.data.user.login);
  }

  @SubscribeMessage('chatroomselected')
  handleJoinchatRoom(client: Socket, roomname: string): void {
    client.join(roomname);


  }
  @SubscribeMessage('autocompleteroom')
  async autocompleteroom(client: Socket,payload : { str: string, roomname:string}) {
   let userProfiles
    if(payload.str !== ''){
     
      const allmembers = await this.roomService.findroommembersautocom(payload.roomname,payload.str);
      userProfiles = allmembers.members.map(user => ({
        login: user.login,     
        avatar: user.avatar   
    }));
  }
  this.websocketService.emitusersToUserroom(client.data.user.id,userProfiles);


  }

@SubscribeMessage('autocomplete')
  async handleautocomplete(client: Socket, str: string) {
    const user = await this.authService.findUser(client.data.user.id);
   let userProfiles
    if(str !== ''){

      const users = await this.authService.findAllUserswith(str);
      const us = await this.friendservice.findallblocked(user);
      const blockingme = await this.friendservice.findallthatblockedme(user);
      const filteredUsers = users.filter(user => {
        return !us.some(blockedUser => blockedUser.id === user.id);
      });
      
      const filteredUsers1 = filteredUsers.filter(user => {
        return !blockingme.some(blockedUser => blockedUser.id === user.id);
      });
      userProfiles = filteredUsers1.map(user => (
        {
        login: user.login,     
        avatar: user.avatar   
    }));
  }
  this.websocketService.emitusersToUser(client.data.user.id,userProfiles);


  }
  @SubscribeMessage('chatroomdeselected')
  handleLeavechatRoom(client: Socket, roomname: string): void {
    client.leave(roomname);

  }

  @SubscribeMessage('newmemberinroom')
  async userjoinroom(client: Socket, payload: { name: string, password: string }) {

   

    const user11 = await this.authService.findUser(client.data.user.id);
    const roomname = payload.name;
    const room = await this.roomService.findroom(roomname);

    if (room.type == "protected") {
      const check = await this.roomService.comparePasswords(payload.password, room.password);

      if (!check) {
        this.websocketService.emiterrorToUser(String(user11.id), "password invalid");
        return;
      }
    }
    const joining = await this.roomService.joinusertoroom(room, user11);
    const members = await this.roomService.findroommembers(roomname);
    for (let i = 0; i < members.members.length; i++) {
      const memberstatus = await this.roomService.getstatusofthemember(room,members.members[i]);
      if(!memberstatus.status || memberstatus.status =="muted")
        this.websocketService.emitToUser(String(members.members[i].id), "newmember");
    }
  }
  @SubscribeMessage('kickuser')
  async kickuser(client: Socket, payload: { id: number, name: string }) {
    const user11 = await this.authService.findUser(client.data.user.id);
    const usermuted = await this.authService.findUser(payload.id);
    const roomname = payload.name;

    const room = await this.roomService.findroom(roomname);
    const kicked = await this.roomService.kickuser(room, usermuted, user11);
    const members = await this.roomService.findroommembers(roomname);

    for (let i = 0; i < members.members.length; i++) {
      const memberstatus = await this.roomService.getstatusofthemember(room,members.members[i]);
      if(!memberstatus.status || memberstatus.status =="muted")
      {
        this.websocketService.emitToUser(String(members.members[i].id), "newmember");
      }
    }
    const bool: Boolean = this.websocketService.checking(payload.id.toString(), payload.name);
    if (bool == true) {

      this.websocketService.emitToUser(payload.id.toString(), "ileaved");
      this.websocketService.emitToUser(payload.id.toString(), "newmember");
    }
    else {
      this.websocketService.emitToUser(payload.id.toString(), "newmember");
    }

  }
  @SubscribeMessage("changeinfodone")
  async changeinfodone(client: Socket)
  {
      const user11 = await this.authService.findUser(client.data.user.id);
      await this.authService.updateUser(user11.id);
  }
  @SubscribeMessage('setadmin')
  async setadmin(client: Socket, payload: { id: number, name: string }) {
    const user11 = await this.authService.findUser(client.data.user.id);
    const useradmin = await this.authService.findUser(payload.id);
    const roomname = payload.name;
    const room = await this.roomService.findroom(roomname);
    const user = await this.roomService.setadmin(room, useradmin, user11);
    const members = await this.roomService.findroommembers(roomname);
    for (let i = 0; i < members.members.length; i++)
    {
      const memberstatus = await this.roomService.getstatusofthemember(room,members.members[i]);
      if(!memberstatus.status || memberstatus.status =="muted")
        this.websocketService.emitToUser(String(members.members[i].id), "newmember");

    }
  }
  @SubscribeMessage('unsetadmin')
  async unsetadmin(client: Socket, payload: { id: number, name: string }) {
    const user11 = await this.authService.findUser(client.data.user.id);
    const useradmin = await this.authService.findUser(payload.id);
    const roomname = payload.name;
    const room = await this.roomService.findroom(roomname);
    const user = await this.roomService.unsetadmin(room, useradmin, user11);
    const members = await this.roomService.findroommembers(roomname);
    for (let i = 0; i < members.members.length; i++)
    {
      const memberstatus = await this.roomService.getstatusofthemember(room,members.members[i]);
      if(!memberstatus.status || memberstatus.status =="muted")
        this.websocketService.emitToUser(String(members.members[i].id), "newmember");

    }
  }
  @SubscribeMessage('banuser')
  async banuser(client: Socket, payload: { id: number, name: string }) {
    const user11 = await this.authService.findUser(client.data.user.id);

    const usertoban = await this.authService.findUser(payload.id);
    const roomname = payload.name;
    const room = await this.roomService.findroom(roomname);
    const user = await this.roomService.banuser(room, usertoban, user11);
    const members = await this.roomService.findroommembers(roomname);
    for (let i = 0; i < members.members.length; i++) {
      this.websocketService.emitToUser(String(members.members[i].id), "newmember");
      if(members.members[i].id == payload.id )
      {
        this.websocketService.emitToUser(payload.id.toString(), "ileaved");

      }
    }
  }
  @SubscribeMessage('muteuser')
  async muteuser(client: Socket, payload: { id: number, name: string }) {
    const user11 = await this.authService.findUser(client.data.user.id);
    const usermuted = await this.authService.findUser(payload.id);
    const roomname = payload.name;
    const room = await this.roomService.findroom(roomname);
    const user = await this.roomService.muteuser(room, usermuted, user11);
    setTimeout(async () => {
      await this.roomService.unmuteuser(room, usermuted, user11);
      this.websocketService.emitToUser(payload.id.toString(), "newmember");
    }, 1 * 20 * 1000);
    this.websocketService.emitToUser(payload.id.toString(), "newmember");
  }
  @SubscribeMessage('userleaveroom')
  async userleaveroom(client: Socket, payload: { name: string, newowner: string }) {
    const user11 = await this.authService.findUser(client.data.user.id);
    const roomname = payload.name;
    const joining = await this.roomService.leaveroom(roomname, user11, payload.newowner);
    if (!joining)
      return;

    const members = await this.roomService.findroommembers(roomname);
    for (let i = 0; i < members.members.length; i++) {
      this.websocketService.emitToUser(members.members[i].id.toString(), "newmember");
    }
    const bool: Boolean = this.websocketService.checking(client.data.user.id.toString(), payload.name);
    if (bool == true) {
      this.websocketService.emitToUser(client.data.user.id.toString(), "ileaved");
      this.websocketService.emitToUser(client.data.user.id.toString(), "newmember");
    }
    else {
      this.websocketService.emitToUser(client.data.user.id.toString(), "newmember");
    }
  }
}





