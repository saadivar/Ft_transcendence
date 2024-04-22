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
       const gamee =  await this.GameRepository.save(game);
       if(game)
        {
            const games = await this.findgames(game.winner);
            let totalwin :number = 0;
                for(let i = 0;i < games.length ; i++)
                {
                    
                    if(games[i].winner.id== game.winner.id)
                        totalwin++;
             }
             const ach = new Acheivment;
            if(totalwin == 1)
            {
                ach.name ="1win";
                ach.belongs = game.winner;
                this.acheivmentrepository.save(ach);

            }
            else if(totalwin == 2)
            {
                ach.name ="2wins";
                ach.belongs = game.winner;
                this.acheivmentrepository.save(ach);

            }
            else if(totalwin == 3)
            {
                ach.name ="3wins";
                ach.belongs = game.winner;
                this.acheivmentrepository.save(ach);

            }
            else if(totalwin == 4)
            {
                ach.name ="4wins";
                ach.belongs = game.winner;
                this.acheivmentrepository.save(ach);

            }
            else if(totalwin == 5)
            {
                ach.name ="5wins";
                ach.belongs = game.winner;
                this.acheivmentrepository.save(ach);

            }
            
        }
       
        //acheivment

    }
    async acheivment(user:User)
    {
        return await this.acheivmentrepository.find({where:{
            belongs:user,
        }})
    }

    async findgames(user:User)
    {
        const games = await this.GameRepository.find({
            where: [
              { player1: user},
              { player2: user },
             
            ],
            relations: ['player1', 'player2','winner','loser'],
          });
        return games;
    }
    ///static
}
