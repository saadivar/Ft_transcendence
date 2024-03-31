import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    ///static
}
