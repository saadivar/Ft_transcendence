import { SubscribeMessage, WebSocketGateway, MessageBody,WebSocketServer ,OnGatewayInit} from '@nestjs/websockets';
import { Server , Socket} from 'socket.io';
import { Room } from './Room';
import { Ball } from './ball';
import { socketmidd } from 'src/realtime/socketmiddlware';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { Game } from 'src/typeorm/entities/game';
import { GameService } from 'src/game/game.service';


let clients = [];

@WebSocketGateway({ cors: true  , namespace: 'game' })
export class GameGateway implements OnGatewayInit {
  constructor(private readonly authService: AuthService,private readonly jwtService: JwtService,private readonly gameservice: GameService){}
  @WebSocketServer() server: Server;
  rooms = new Map();
  gamesList = new Map<string, string>();

  afterInit( client:Socket){
    client.use(socketmidd(this.jwtService,this.authService) as any)
  } 
  getClientRoomName(clientId : string){
      for(let [roomName, room] of this.rooms){
          if (room.client1?.id == clientId || room.client2?.id == clientId)
            return (roomName);
      }
    }
  @SubscribeMessage('CREATEROOM')
    createRoom(client: Socket) {
      if (clients.length != 0){
          this.rooms.get(clients[0]).client2 = client;
          this.rooms.get(clients[0]).client2Name = client.data.user.login;
          this.rooms.get(clients[0]).client2Avatar = client.data.user.avatar; 
          client.join(clients[0]);
          this.rooms.get(clients[0]).client1.emit('start', [clients[0], client.data.user.login, this.rooms.get(clients[0]).client1Avatar, this.rooms.get(clients[0]).client2Avatar]);
          this.rooms.get(clients[0]).client2.emit('start', [clients[0], client.data.user.login, this.rooms.get(clients[0]).client1Avatar, this.rooms.get(clients[0]).client2Avatar]);
          clients = clients.slice(1);
      }
      else{
        const newRoom = new Room(client.data.user.login);
        newRoom.client1 = client;
        newRoom.client1Name = client.data.user.login;
        newRoom.client1Avatar = client.data.user.avatar;
        this.rooms.set(client.data.user.login, newRoom);
        client.join(client.data.user.login);
        clients.push(client.data.user.login);
      }

    }
  @SubscribeMessage('JOINROOM')
    joinRoom(client : Socket, data : string[]){ // data[0] ==> roomNAma && data[1] ==> USERNAME

      if (this.rooms.has(data[0])){
        if (this.rooms.get(data[0]).client2 != undefined)
        {
          return;
        }
        this.rooms.get(data[0]).client2 = client;
        this.rooms.get(data[0]).client2Name = data[1];
        client.join(data[0]);
        // removeGameList(data[0]);
      }
      else 
        {}
    }
    @SubscribeMessage('index')
      getIndex(client : Socket, roomName : string){
        if (this.rooms.get(roomName)?.client1.id == client.id)
          client.emit('index', 0);
        else if (this.rooms.get(roomName)?.client2.id == client.id)
          client.emit('index', 1);
        else{
          

        }
      }
  @SubscribeMessage('data')
  handleData(@MessageBody() data : [Ball, string]) {
      this.server.to(data[1])?.emit('data', data);
  }


  @SubscribeMessage('PlayerMoves')
  playerMoves(@MessageBody() data : [any, any, string, number]){
    let room = this.rooms.get(data[2]);
    if (data[3] == 0)
      room.client2.emit('PlayerMoves', data[0], data[1])
    else if (data[3] == 1)
      room.client1.emit('PlayerMoves', data[0], data[1]);
    else
      {}
  }
  @SubscribeMessage('moveX')
  handlePlayer2Moves(@MessageBody() data : [string, number]){
    this.rooms.get(data[0]).client1.emit('moveX', data[1]);
  }
  @SubscribeMessage('moveX')
  handlePlayerMoveZ(@MessageBody() data : [string, number]){
    this.rooms.get(data[0]).client1.emit('moveZ', data[1]);
  }

  @SubscribeMessage('setstart') 
  handleStart(client : Socket, roomName : string){
    // this.server.to(roomName).emit('start');


    this.rooms.get(roomName).client1.emit('start', roomName);
    this.rooms.get(roomName).client2.emit('start', roomName);
  }

  @SubscribeMessage('speed')
  ballSpeed(@MessageBody() data : [string, number]){
      
    if (data[1] < -200){
      this.rooms.get(data[0])?.client1?.emit('speed', 10);
      this.rooms.get(data[0])?.client1?.emit('falligPoint', 3);

    }
    else if (data[1] < -150){
      this.rooms.get(data[0])?.client1?.emit('speed', 7);
      this.rooms.get(data[0])?.client1?.emit('falligPoint', 3);

    }
    else if (data[1] < -100){
      this.rooms.get(data[0])?.client1?.emit('speed', 6);
      this.rooms.get(data[0])?.client1?.emit('falligPoint', 3);
    }
    else{
      this.rooms.get(data[0])?.client1?.emit('speed', 3);
      this.rooms.get(data[0])?.client1?.emit('falligPoint', 4);
    }

  }
  @SubscribeMessage('score')
  scoreEvent(@MessageBody() score : any[]){
    this.server.to(score[2]).emit('score', score);
  }

  @SubscribeMessage('endGame')
  async endGame(@MessageBody() playerScore : any[]){
    this.server.to(playerScore[2]).emit('endGame', playerScore);

    const p1 = await this.authService.findUserbylogin(this.rooms.get(playerScore[2]).client1Name);
    const p2 = await this.authService.findUserbylogin(this.rooms.get(playerScore[2]).client2Name);
    const game = new Game;
    game.player1 = p1;
    game.player2 = p2;
    game.score1 = playerScore[0];
    game.score2 = playerScore[1];
    if(playerScore[0] > playerScore[1])
    {
      game.winner = p1;
      game.loser = p2;
    }
    else
    {
      game.winner = p2;
      game.loser = p1;
    }
    await this.gameservice.savegamedata(game);

    this.rooms.delete(playerScore[2]);
  }

  handleConnection(client : Socket){
    const valuesArray = Array.from(this.gamesList.values());
    client.emit('GamesList', valuesArray);
  }

  handleDisconnect(client : Socket){
    this.gamesList.delete(client.id);
    const valuesArray = Array.from(this.gamesList.values());
    this.server.emit('GamesList', valuesArray);
    const clientRoom = this.getClientRoomName(client.id);
    this.server.to(clientRoom)?.emit('endGame', [5, 4]);
    if (clients[0] == client.data.user.login)//! mzl matistat
      clients = clients.slice(1);
  }  
}