import { Module, forwardRef } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Chat } from 'src/typeorm/entities/chat';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Room } from 'src/typeorm/entities/rooms';
import { RoomService } from 'src/room/room.service';
import { Message } from 'src/typeorm/entities/message';
import { AuthModule } from 'src/auth/auth.module';
import { WebsocketService } from 'src/realtime/Websocketservice';
import { FriendsModule } from 'src/friends/friends.module';
import { RoomModule } from 'src/room/room.module';
import { jwtguard } from 'src/guards/jwtguqrd';


@Module({
  imports:[forwardRef(() =>AuthModule),forwardRef(() => FriendsModule),forwardRef(() => RoomModule),
    TypeOrmModule.forFeature([Chat,Message]),JwtModule.register({secret:`${process.env.JWTSECRET}`,
  signOptions:{expiresIn:'1d'}})
  ],
  controllers: [ChatController],
  providers: [ChatService,WebsocketService],
  exports:[ChatService]
})
export class ChatModule {}
