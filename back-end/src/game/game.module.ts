import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { Game } from 'src/typeorm/entities/game';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports:[AuthModule,TypeOrmModule.forFeature([Game]),JwtModule.register({
    secret: "secret",
    signOptions: { expiresIn: '1d' }
  })],
  controllers: [GameController],
  providers: [GameService],
  exports:[GameService],
})
export class GameModule {}
