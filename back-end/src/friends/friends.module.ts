import { Module, forwardRef } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friends } from 'src/typeorm/entities/friends';
import { JwtModule } from '@nestjs/jwt';
import { Blocked } from 'src/typeorm/entities/blocked';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { WebsocketService } from 'src/realtime/Websocketservice';
import { ChatModule } from 'src/chat/chat.module';
import { Notif } from 'src/typeorm/entities/notif';


@Module({
  imports:[forwardRef(() => AuthModule),forwardRef(() => ChatModule),
    TypeOrmModule.forFeature([Friends,Blocked,Notif]),JwtModule.register({secret:`${process.env.JWTSECRET}`,
  signOptions:{expiresIn:'1d'}})
  ], 
  providers: [FriendsService,WebsocketService,],
  controllers: [FriendsController],
  exports:[FriendsService]
})
export class FriendsModule {}
