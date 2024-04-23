import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import e from "express";
import { send } from "process";
import { RoomMember } from "src/typeorm/entities/RoomMember";
import { User } from "src/typeorm/entities/User";
import { Blocked } from "src/typeorm/entities/blocked";
import { Chat } from "src/typeorm/entities/chat";
import { Friends } from "src/typeorm/entities/friends";
import { Message } from "src/typeorm/entities/message";
import { Notif } from "src/typeorm/entities/notif";
import { Room } from "src/typeorm/entities/rooms";
import * as path from  'path'

import { BlockedDtails, ChatDtails, FriendsDtails, MessageDtails, NotifDtails, RoomDtails, RoomMemberDtails, UserDetails } from "src/types/types";
import { ILike, Like, Not, Repository} from "typeorm";

@Injectable()
export class AuthService{
    constructor (@InjectRepository(User) private readonly userRepository : Repository<User>,@InjectRepository(Notif) private readonly notifrepository : Repository<Notif>
    )
    {} 
    async validateUser(details:UserDetails){
        const user = await this.userRepository.findOneBy({email: details.email});
        if(user) {
          return user;
        }
        let login: string;
         do {
          login = Math.random().toString(36).substring(7);
        } while (await this.userRepository.findOneBy({ login }));
        details.login += login;
        const newuser =  this.userRepository.create(details);
        return  this.userRepository.save(newuser);
    }
    async findUser(id:number)
    {
        const user= await this.userRepository.findOneBy({id});
        return user;
    }
    
    async updateUser(id:number)
    {
        const user= await this.userRepository.findOneBy({id});
        user.isNew = false;
        this.userRepository.save(user);
        return user;
    }
    async saveuser(user:User)
    {
       return await this.userRepository.save(user);
    }
    async findUserbylogin(login)
    {
        const user= await this.userRepository.findOneBy({login});
        return user;
    }

    async findAllUsers() {
        return this.userRepository.find();
      }
      async update(user:User) {

        return await this.userRepository.save(user);
      }
      async changestatus(userid:number,status:string) {
        const user =  await this.userRepository.findOneBy({id:userid});
        if(user)
        {
          if(status == "online")
            user.status = "online";
          else if(status == "offline")
            user.status = "offline";
          else if(status == "ingame")
            user.status = "ingame";  
          return await this.userRepository.save(user);
        }
        
      }
    async findnumberofnotif(userid:number) : Promise<number>{ 

      const numb = await this.userRepository.findOne({relations:["notif"],where:{
        id:userid
      }});
      const notreaded = numb.notif.filter((not)=> not.isReaded === false);
      return notreaded.length;

    }
    async createnotif(details:NotifDtails)
    {
        const notification = this.notifrepository.create(details);
        return await this.notifrepository.save(notification);
    }
    async updatepending(type:string,user:User)
    {
      let readednotif;
      if(type === "pending")
      {
        readednotif = await this.notifrepository.find({where:{
          user:user,isReaded:false
        }});
        for(const notif of readednotif){
          notif.isReaded = true;

        }
      }
      
    }

    async getnotifications(user:User)
    {
      if(user)
      {
        const notif = await this.userRepository.findOne({relations:["notif","notif.sender"],where:{
          id:user.id
        }});
        const notreaded = notif.notif.filter((not)=> not.isReaded === false).map((not) => ({
          type: not.type,
          senderid: not.sender.id
        }));
        return notreaded;
      }
      
    }
    
    async updatenotification(type:string,user:User,senderid:number):Promise<void>
    {
      let readednotif;
      

      if(type === "pending")
      {
        readednotif = await this.notifrepository.find({where:{
          user:user,isReaded:false,type:"pending",
        }});
        for(const notif of readednotif){
          notif.isReaded = true;
        }
        this.notifrepository.save(readednotif);
      }
      else if(type === "message")
      {
        const sender = await this.userRepository.findOneBy({id:senderid});
        readednotif = await this.notifrepository.find({where:{
          user:user,isReaded:false,sender:sender,type:"message",
        }});   
        for(const notif of readednotif){
          notif.isReaded = true;
          await this.notifrepository.save(readednotif);
        }
      }
      /////////////////////////
      
    
    }
   
    async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
  
      return this.userRepository.update(userId, {
        twoFactorAuthenticationSecret: secret
      });
    }
    async turnOnTwoFactorAuthentication(userId: number) {

      return this.userRepository.update(userId, {
        isTwoFactorAuthenticationEnabled: true
      });
      
    }
    async turnOffTwoFactorAuthentication(userId: number) {

      return this.userRepository.update(userId, {
        isTwoFactorAuthenticationEnabled: false
      });}
      async findAllUserswith(str :string){

        const users = await  this.userRepository.find({where:{
          login: Like(`${str}%`)
          
        }})
        return users;
      }
}