import { Injectable, Scope } from '@nestjs/common';
import { log } from 'console';
import { Socket } from 'socket.io';
import { User } from 'src/typeorm/entities/User';

@Injectable({ scope: Scope.DEFAULT })
export class WebsocketService {
  private static readonly connectedUsers: Map<string, Socket> = new Map();

  addUserToMap(userId: string, socket: Socket): void {
    WebsocketService.connectedUsers.set(userId, socket);
    // console.log(WebsocketService.connectedUsers.size);

  }
  removeUserFromMap(userId: string): void {
    WebsocketService.connectedUsers.delete(userId);
  }
  emitToUser(userId: string, event: string): void {
    for (const userID of WebsocketService.connectedUsers.keys()) {
      if(userId == userID)
      {
            const userSocket = WebsocketService.connectedUsers.get(userID);
            if(userSocket)
              {
                console.log(event ," to ",userID);
                userSocket.emit(event);
              }
        }
        
      }   
  }
  
  emitgameacccepttouser(userId: string,userlogin:string): void {
    for (const userID of WebsocketService.connectedUsers.keys()) {
      if (userId == userID)
      {
        const userSocket = WebsocketService.connectedUsers.get(userID);
        if(userSocket)
            userSocket.emit("acceptGame", {userlog:userlogin});
        }
      }   
  }
  emitmessgaetouser(client: Socket, payload: {from:string;fromid:string; to: string; content: string }): void {
    const {from,fromid ,to, content } = payload;
    for (const userID of WebsocketService.connectedUsers.keys()) {
      if(to == userID || fromid == userID)
      {
        const recipient = WebsocketService.connectedUsers.get(userID);
        if (recipient) {
          recipient.emit('message');
          if(fromid != userID)
            this.emitnotifToUser(to,"notif","message",fromid);
        }
      }
      
    }
    
    
  }
  emitnotifToUser(userId: string, event: string,typeofnotif:string,to:string): void {
    for (const userID of WebsocketService.connectedUsers.keys()) {
      if(userId == userID)
      {
            const userSocket = WebsocketService.connectedUsers.get(userID);
            if(userSocket)
                userSocket.emit(event,{type:typeofnotif,senderid:to});
        }
        
      }   
  }
  emiterrorToUser(userId: string,type:string): void {
    for (const userID of WebsocketService.connectedUsers.keys()) {
      if(userId == userID)
      {
            console.log("herre");
            const userSocket = WebsocketService.connectedUsers.get(userID);
            if(userSocket)
                userSocket.emit("error",{type:type});
        }
        
      }   
  }
  emitgameToUser(userId: string,user:User): void {
    for (const userID of WebsocketService.connectedUsers.keys()) {
      if(userId == userID)
      {
            const userSocket = WebsocketService.connectedUsers.get(userID);
            if(userSocket)
                userSocket.emit("invitegame",user);
        }
        
      }   
  }
  emitusersToUser(userId: string,user:any[]): void {
    for (const userID of WebsocketService.connectedUsers.keys()) {
      if (userId == userID)
      {
        const userSocket = WebsocketService.connectedUsers.get(userID);
        if(userSocket)
            userSocket.emit("autocomplete", {users:user});
        }
      }   
  }
  emitusersToUserroom(userId: string,user:any[]): void {
    for (const userID of WebsocketService.connectedUsers.keys()) {
      if (userId == userID)
      {
        const userSocket = WebsocketService.connectedUsers.get(userID);
        if(userSocket)
            userSocket.emit("autocompleteroom", {users:user});
        }
      }   
  }

   checking(userid :string,roomname: string ): boolean
  {
    for (const userID of WebsocketService.connectedUsers.keys()) {
      if(userid == userID)
      {
            const userSocket = WebsocketService.connectedUsers.get(userID);
            if(userSocket)
            {
                if(!userSocket.rooms.has(roomname))
                {
                  return false;
                }
                else
                  return true; 
            }
        }
      } 
  }

}
