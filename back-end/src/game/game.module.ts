import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { Game } from 'src/typeorm/entities/game';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports:[TypeOrmModule.forFeature([Game])],
  controllers: [GameController],
  providers: [GameService],
  exports:[GameService],
})
export class GameModule {}
