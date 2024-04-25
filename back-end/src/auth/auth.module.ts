import { MiddlewareConsumer, Module, NestModule, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { IntraStrategy } from './intra42/IntraStrategy';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { JwtModule } from '@nestjs/jwt';
import { Friends } from 'src/typeorm/entities/friends';
import { WebsocketService } from 'src/realtime/Websocketservice';
import { Message } from 'src/typeorm/entities/message';
import { Chat } from 'src/typeorm/entities/chat';
import { Blocked } from 'src/typeorm/entities/blocked';
import { Room } from 'src/typeorm/entities/rooms';
import { RoomMember } from 'src/typeorm/entities/RoomMember';
import { Notif } from 'src/typeorm/entities/notif';
import { TwoFactorAuthenticationService } from './2fa.service';
import { TwoFactorAuthenticationController } from './2fa.controller';
import { FriendsModule } from 'src/friends/friends.module';
import { GameModule } from 'src/game/game.module';

@Module({
    imports:[forwardRef(() => FriendsModule),forwardRef(() =>GameModule),
        TypeOrmModule.forFeature([User,Notif]),JwtModule.register({secret:`${process.env.JWTSECRET}`,
    signOptions:{expiresIn:'1d'}})
    ],
    controllers:[AuthController,TwoFactorAuthenticationController],
    providers:[IntraStrategy,
        AuthService,WebsocketService,TwoFactorAuthenticationService],
    exports: [AuthService],
})
export class AuthModule {}