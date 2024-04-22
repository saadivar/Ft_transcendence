import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { Chat } from 'src/typeorm/entities/chat';
import { Message } from 'src/typeorm/entities/message';
import { Room } from 'src/typeorm/entities/rooms';
import { ChatDtails, MessageDtails } from 'src/types/types';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {

    constructor(@InjectRepository(Chat) private readonly chatrepository : Repository<Chat>,@InjectRepository(Message) private readonly messagerepository : Repository<Message>
    ,){}
    
    async newchat(details:ChatDtails)
    {
        const chat = await this.chatrepository.create(details);    
        return await this.chatrepository.save(chat);
    }
    async findChatByFriendshipId(det:ChatDtails) {
        return this.chatrepository.findOne({where:{
          friends: det.friends
        }});
      }
      async findChatByroomid(det:ChatDtails) {
        return this.chatrepository.findOne({where:{
          rooms: det.rooms
        }});
      }
      
      /////message

      async createmessage(details:MessageDtails)  {
        if(!details.chat)
          return "blocked";
        
        const message = await this.messagerepository.create(details);
        message.sender = details.sendr;
        return this.messagerepository.save(message);
      }
      
      async findMessagesByChatId(chatId: number): Promise<Message[]> {
        return this.messagerepository.find({ where: { chat: { id: chatId } },relations: ['sender'],order: {
          id: "ASC",
        },});
      }
      
   
      
      
      
    
}
