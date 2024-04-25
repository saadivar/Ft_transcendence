import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/User';
import { PassportModule } from '@nestjs/passport';
import { Friends } from './typeorm/entities/friends';
import { RealtimeGateway } from './realtime/realtime.gateway';
import { WebsocketService } from './realtime/Websocketservice';
import { Chat } from './typeorm/entities/chat';
import { Message } from './typeorm/entities/message';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { Blocked } from './typeorm/entities/blocked';
import { Room } from './typeorm/entities/rooms';
import { RoomMember } from './typeorm/entities/RoomMember';
import { UsersModule } from './users/users.module';
import { FriendsModule } from './friends/friends.module';
import { ChatModule } from './chat/chat.module';
import { RoomModule } from './room/room.module';
import { ConfigModule } from '@nestjs/config';
import { Notif } from './typeorm/entities/notif';
import { Game } from './typeorm/entities/game';
import { GameModule } from './game/game.module';
import { GameGateway } from './gamegateway/game.gateway';
import { Acheivment } from './typeorm/entities/acheivment';


@Module({
  imports: [AuthModule,TypeOrmModule.forRoot({
    type:'postgres',
    host: `${process.env.DB_HOST}`,
    port: Number(`${process.env.DB_PORT}`),
    username: `${process.env.POSTGRES_USER}`,
    password: `${process.env.POSTGRES_PASSWORD}`,
    database: `${process.env.POSTGRES_DB}`,
    entities: [User,Friends,Chat,Message,Blocked,Room,RoomMember,Notif,Game,Acheivment],
    synchronize: true,
  }),JwtModule.register({secret:`${process.env.JWTSECRET}`,
  signOptions:{expiresIn:'1d'}})
  ,
  PassportModule.register({session: true}),
  UsersModule,FriendsModule, ChatModule, RoomModule,ConfigModule.forRoot({
    envFilePath: '.env',isGlobal: true,
  }), GameModule,
  ],
  controllers: [AppController],
  providers: [AppService, RealtimeGateway,WebsocketService,GameGateway],
}) 
export class AppModule {} 

