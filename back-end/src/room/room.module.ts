import { Module, forwardRef } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { Room } from 'src/typeorm/entities/rooms';
import { RoomMember } from 'src/typeorm/entities/RoomMember';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ChatModule } from 'src/chat/chat.module';
import { WebsocketService } from 'src/realtime/Websocketservice';
import { jwtguard } from 'src/guards/jwtguqrd';
import { Notif } from 'src/typeorm/entities/notif';



@Module({
  imports: [forwardRef(() => AuthModule), forwardRef(() => ChatModule),
    TypeOrmModule.forFeature([Room, RoomMember,Notif]), JwtModule.register({
      secret:`${process.env.JWTSECRET}`,
      signOptions: { expiresIn: '1d' }
    })
  ],
  controllers: [RoomController],
  providers: [RoomService, WebsocketService,],
  exports: [RoomService]
})
export class RoomModule { }
