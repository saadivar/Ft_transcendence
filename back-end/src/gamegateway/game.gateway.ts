import { SubscribeMessage, WebSocketGateway, MessageBody,WebSocketServer ,OnGatewayInit} from '@nestjs/websockets';
import { Server , Socket} from 'socket.io';
import { Room } from './Room';
import { socketmidd } from 'src/realtime/socketmiddlware';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { Game } from 'src/typeorm/entities/game';
import { GameService } from 'src/game/game.service';
import { copyFileSync } from 'node:fs';
import { WebsocketService } from 'src/realtime/Websocketservice';
import { FriendsService } from 'src/friends/friends.service';


interface Ball {
  x : number;
  y : number;
  z : number;
}

let clients = [];
const inGame = [];

@WebSocketGateway({ cors: true  , namespace: 'game' })
export class GameGateway implements OnGatewayInit {
  constructor(private readonly authService: AuthService,private readonly jwtService: JwtService,private readonly gameservice: GameService,private readonly websocketService: WebsocketService, private readonly friendservice: FriendsService){}
  @WebSocketServer() server: Server;
  rooms = new Map();
  gamesList = new Map<string, string>();

  afterInit( client:Socket){
    client.use(socketmidd(this.jwtService,this.authService) as any)
  } 
  getClientRoomName(clientId : string){
      for(let [roomName, room] of this.rooms){
          if (room?.client1?.id == clientId || room?.client2?.id == clientId)
            return (roomName);
      }
    }

  @SubscribeMessage('InviteMatching')
  async inviteMatching(client : Socket, inveterName : string){
    if (!inGame.includes(client.data.user?.login)){
      const newRoom = new Room(client.data.user?.login);
      newRoom.client1 = client;
      newRoom.client1Name = client.data.user?.login;
      newRoom.client1Avatar = client.data.user?.avatar;
      this.rooms.set(client.data.user?.login, newRoom);
      client.join(client.data.user?.login);
      inGame.push(client.data.user?.login);
      await this.authService.changestatus(client.data.user?.id,"ingame");
      const user = await this.authService.findUser(client.data.user?.id);
      const friends = await this.friendservice.findAllacceotedfriends(user);
      for(let i = 0; i < friends.length;i++)
      {
        this.websocketService.emitToUser(friends[i]?.id?.toString(),"friendRequestReceived");
      }
      client.emit('success');
    }
    else{
      client.emit('error');
    }
  }

  @SubscribeMessage('InviterJoining')
  async inviterJoining(client : Socket, roomName : any){
    roomName = roomName.userlog;

    if (!inGame.includes(client.data.user?.login)){
      const room = this.rooms.get(roomName);
      if (room){
        room.client2 = client;
        room.client2Name = client.data.user?.login;
        room.client2Avatar = client.data.user?.avatar;
        client.join(roomName);
        inGame.push(client.data.user?.login);
        await this.authService.changestatus(client.data.user?.id,"ingame");
        const user = await this.authService.findUser(client.data.user?.id);
        const friends = await this.friendservice.findAllacceotedfriends(user);
        for(let i = 0; i < friends.length;i++)
        {
          this.websocketService.emitToUser(friends[i]?.id?.toString(),"friendRequestReceived");
        }
        room.client1?.emit('start', [roomName, client.data.user?.login, room.client1Avatar, room.client2Avatar]);
        room.client2?.emit('start', [roomName, client.data.user?.login, room.client1Avatar, room.client2Avatar]);
      }
    }
  }


  @SubscribeMessage('CREATEROOM')
  async createRoom(client: Socket) {
      if (clients?.length != 0 && clients[0] != client.data.user?.login && !inGame.includes(client.data.user?.login)){
        const room = this.rooms.get(clients[0]);
        if (room){
          room.client2 = client;
          room.client2Name = client.data.user?.login;
          room.client2Avatar = client.data.user?.avatar; 
          client.join(clients[0]);
          room.client1?.emit('start', [clients[0], client.data.user?.login, room.client1Avatar, room.client2Avatar]);
          room.client2?.emit('start', [clients[0], client.data.user?.login, room.client1Avatar, room.client2Avatar]);
          clients.splice(0, 1);
          inGame.push(client.data.user?.login);
          await this.authService.changestatus(client.data.user?.id,"ingame");
          const user = await this.authService.findUser(client.data.user?.id);
          const friends = await this.friendservice.findAllacceotedfriends(user);
          for(let i = 0; i < friends.length;i++)
          {
            this.websocketService.emitToUser(friends[i]?.id?.toString(),"friendRequestReceived");
          }
        }
      }
      else if (clients.length == 0 && !inGame.includes(client.data.user?.login)){
        const newRoom = new Room(client.data.user?.login);
        newRoom.client1 = client;
        newRoom.client1Name = client.data.user?.login;
        newRoom.client1Avatar = client.data.user?.avatar;
        this.rooms.set(client.data.user?.login, newRoom);
        client.join(client.data.user?.login);
        clients.push(client.data.user?.login);
        inGame.push(client.data.user?.login);
        await this.authService.changestatus(client.data.user?.id,"ingame");
        const user = await this.authService.findUser(client.data.user?.id);
        const friends = await this.friendservice.findAllacceotedfriends(user);
        for(let i = 0; i < friends.length;i++)
        {
          this.websocketService.emitToUser(friends[i]?.id?.toString(),"friendRequestReceived");
        }
      }
    
    }

    @SubscribeMessage('index')
      getIndex(client : Socket, roomName : string){
        if (this.rooms.get(roomName)?.client1?.id == client.id)
          client.emit('index', 0);
        else if (this.rooms.get(roomName)?.client2?.id == client.id)
          client.emit('index', 1);
      }
  @SubscribeMessage('data')
  handleData(@MessageBody() data : [Ball, string]) {
      this.server.to(data[1])?.emit('data', data);
  }


  @SubscribeMessage('PlayerMoves')
  playerMoves(@MessageBody() data : [any, any, string, number]){
    let room = this.rooms.get(data[2]);
    if (data[3] == 0)
      room?.client2?.emit('PlayerMoves', data[0], data[1])
    else if (data[3] == 1)
      room?.client1?.emit('PlayerMoves', data[0], data[1]);
    else
      {}
  }
  @SubscribeMessage('moveX')
  handlePlayer2Moves(@MessageBody() data : [string, number]){
    this.rooms.get(data[0])?.client1?.emit('moveX', data[1]);
  }
  @SubscribeMessage('moveZ')
  handlePlayerMoveZ(@MessageBody() data : [string, number]){
    this.rooms.get(data[0])?.client1?.emit('moveZ', data[1]);
  }

  @SubscribeMessage('setstart') 
  handleStart(client : Socket, roomName : string){
    this.rooms.get(roomName)?.client1?.emit('start', roomName);
    this.rooms.get(roomName)?.client2?.emit('start', roomName);
  }

  @SubscribeMessage('speed')
  ballSpeed(@MessageBody() data : [string, number]){
      this.rooms.get(data[0])?.client1?.emit('speed', 2.5);
      this.rooms.get(data[0])?.client1?.emit('p2deltaT', 1/40);
      this.rooms.get(data[0])?.client1?.emit('falligPoint', 5);
  }
  @SubscribeMessage('score')
  scoreEvent(@MessageBody() score : any[]){
    this.server.to(score[2]).emit('score', score);
  }

  @SubscribeMessage('exit')
   handleExit(client : Socket){
      client.emit('exit');
  }
  @SubscribeMessage('setScore')
  async setScore(client : Socket, roomName : string){
      const p1 = await this.authService.findUserbylogin(this.rooms.get(roomName)?.client1Name);
      const p2 = await this.authService.findUserbylogin(this.rooms.get(roomName)?.client2Name);
      const game = new Game;
      game.player1 = p1;
      game.player2 = p2;
      if(this.rooms.get(roomName)?.client1Name != client.data.user?.login)
      {
        game.score1 = 5;
        game.score2 = 0;
        this.rooms.get(roomName)?.client1?.emit('endGame' ,"You Win ");
        this.rooms.get(roomName)?.client2?.emit('endGame' ,"You Lose ");
        game.winner = p1;
        game.loser = p2;
      }
      else
      {
        game.score1 = 0;
        game.score2 = 5;
        this.rooms.get(roomName)?.client1?.emit('endGame' ,"You Lose ");
        this.rooms.get(roomName)?.client2?.emit('endGame' ,"You Win ");
        game.winner = p2;
        game.loser = p1;
      }
      await this.gameservice.savegamedata(game);
    this.rooms.delete(roomName);
  }

  @SubscribeMessage('endGame')
  async endGame(@MessageBody() playerScore : any[]){
    const p1 = await this.authService.findUserbylogin(this.rooms.get(playerScore[2])?.client1Name);
    const p2 = await this.authService.findUserbylogin(this.rooms.get(playerScore[2])?.client2Name);
    const game = new Game;
    game.player1 = p1;
    game.player2 = p2;
    game.score1 = playerScore[0];
    game.score2 = playerScore[1];
    if(playerScore[0] > playerScore[1])
    {
      this.rooms.get(playerScore[2])?.client1?.emit('endGame' ,"You Win ");
      this.rooms.get(playerScore[2])?.client2?.emit('endGame' ,"You Lose ");
      game.winner = p1;
      game.loser = p2;
    }
    else
    {
      this.rooms.get(playerScore[2])?.client1?.emit('endGame' ,"You Lose ");
      this.rooms.get(playerScore[2])?.client2?.emit('endGame' ,"You Win ");
      game.winner = p2;
      game.loser = p1;
    }
    await this.gameservice.savegamedata(game);

    this.rooms.delete(playerScore[2]);
  }

  @SubscribeMessage('isInGame')
  isInGame(client : Socket, playerName : string){
    if (!inGame.includes(playerName)){
      client.emit('NotInGame');
    }
    else
      client.emit('PlayerInGame');
  }
  

  handleConnection(client : Socket){
    const valuesArray = Array.from(this.gamesList.values());
    client.emit('GamesList', valuesArray);
  }

  async handleDisconnect(client : Socket){
    const clientRoom = this.getClientRoomName(client.id);
    if (clients[0] == client.data.user?.login)
      clients.splice(0, 1);
    inGame.splice(inGame.indexOf(client.data.user?.login), 1);
    this.server.to(clientRoom)?.emit('endGame', "You Win");
    
    await this.authService.changestatus(client.data.user?.id,"online");
    const user = await this.authService.findUser(client.data.user?.id);
    const friends = await this.friendservice.findAllacceotedfriends(user);
    for(let i = 0; i < friends.length;i++)
    {
      this.websocketService.emitToUser(friends[i]?.id?.toString(),"friendRequestReceived");
    }
    
  }
}