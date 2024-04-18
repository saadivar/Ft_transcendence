import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { Acheivment } from 'src/typeorm/entities/acheivment';
import { Game } from 'src/typeorm/entities/game';
import { GameDetails } from 'src/types/types';
import { Repository } from 'typeorm';

@Injectable()
export class GameService {

    constructor(
        @InjectRepository(Game) private readonly GameRepository : Repository<Game>,@InjectRepository(Acheivment)  private readonly acheivmentrepository : Repository<Acheivment>
    ){}

    async savegamedata(game:Game)
    {
        await this.GameRepository.save(game);
        //acheivment

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
