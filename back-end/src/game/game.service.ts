import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { Game } from 'src/typeorm/entities/game';
import { GameDetails } from 'src/types/types';
import { Repository } from 'typeorm';

@Injectable()
export class GameService {

    constructor(
        @InjectRepository(Game) private readonly GameRepository : Repository<Game>,
    ){}

    async savegamedata(game:Game)
    {
        await this.GameRepository.save(game);
    }
    async findgames(user:User)
    {
        const games = await this.GameRepository.find({
            where: [
              { player1: user},
              { player2: user },
             
            ],
            relations: ['player1', 'player2'],
          });
        return games;
    }
    ///static
}
