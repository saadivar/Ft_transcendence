import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/typeorm/entities/User';
import { Blocked } from 'src/typeorm/entities/blocked';
import { Friends } from 'src/typeorm/entities/friends';
import { UsersService } from 'src/users/users.service';
import { BlockedDtails, ChatDtails, FriendsDtails } from 'src/types/types';
import { Repository } from 'typeorm';

@Injectable()
export class FriendsService {

    constructor(@InjectRepository(Friends) private readonly friendrepository : Repository<Friends>,@InjectRepository(Blocked) private readonly blockedrepository : Repository<Blocked>,
    
    ){}
    async confirmfriendship(details:FriendsDtails){
        if (details.user1.id === details.user2.id) {
          // Users are the same, handle the error or return an appropriate response
          return "me";
        }
        const isblocked  = await this.blockedrepository.findOne({
          where: 
            { user1: details.user1, user2: details.user2 },
        })
        if(isblocked)
          return "not";
        const isblocked1  = await this.blockedrepository.findOne({
            where: 
              { user1: details.user2, user2: details.user1 },
          })
        if(isblocked1)
          return "blocked";
        const existingFriendship = await this.friendrepository.findOne({
          where: [
            { user1: details.user1, user2: details.user2 },
            { user1: details.user2, user2: details.user1 },
          ],
        });
          if (existingFriendship) {
            return "";
          }
        
        const newfriends = this.friendrepository.create(details);
        return this.friendrepository.save(newfriends);
    }
    async findAllfriends(user: User) {
      const friendships = await this.friendrepository.find({
        where: [
          { user1: user, isAccepted: false },
         
        ],
        relations: ['user1', 'user2'],
      });
      const users = friendships.map(friendship => {
        return friendship.user1.id === user.id ? friendship.user2 : friendship.user1;
      });
      return users;
    }
    async findAllacceotedfriends(user: User) {
      const friendships = await this.friendrepository.find({
        where: [
          { user1: user, isAccepted: true },
          { user2: user, isAccepted: true },
         
        ],
        relations: ['user1', 'user2'],
      });
      const users = friendships.map(friendship => {
        return friendship.user1.id === user.id ? friendship.user2 : friendship.user1;
      });
      return users;
    }

    async acceptFriend(user:User,userr:User): Promise<Friends> {
        try {
          const friend = await this.friendrepository.findOne({
            where: [
              { user1: user,user2: userr ,isAccepted: false },
             
            ],
          });
          friend.isAccepted = true;
          await this.friendrepository.save(friend);
    
          return friend;
      }
      catch(error){
  
      }
    }
    async updatechatfriends(friend : Friends){
        await this.friendrepository.save(friend);
      }

      async findfriendship(details:FriendsDtails)  {
    
        const existingFriendship = await this.friendrepository.findOne({
          where: [
            { user1: details.user1, user2: details.user2 },
            { user1: details.user2, user2: details.user1 },
          ],
        });
      if (existingFriendship) {
        return existingFriendship;
      }
      
    }
    async deletefriendship(friendship:Friends)
  {
    return this.friendrepository.delete(friendship);
  }
      //////blocked


      async findallblocked(user: User) {
        const blocked = await this.blockedrepository.find({
          where: 
            { user1: user },
           
          relations: ['user1', 'user2'],
        });
        const users = blocked.map(block => {
          return block.user1.id === user.id ? block.user2 : block.user1;
        });
        return users;
      }

      async findblocked(details:FriendsDtails)  {
    
        const existingFriendship = await this.blockedrepository.findOne({
          where: [
            { user1: details.user1, user2: details.user2 },
            { user1: details.user2, user2: details.user1 },
          ],
        });
      if (existingFriendship) {
        return existingFriendship;
      }
      
    }
    
  async deleteblockedrow(blocked:Blocked)
  {
    return this.blockedrepository.delete(blocked);
  }
  async blocking(blocking:BlockedDtails)
  {
    const block =  await this.blockedrepository.create(blocking);
    return this.blockedrepository.save(blocking)
  }
  

}
