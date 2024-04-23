import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomMember } from 'src/typeorm/entities/RoomMember';
import { User } from 'src/typeorm/entities/User';
import { Room } from 'src/typeorm/entities/rooms';
import { RoomDtails, RoomMemberDtails } from 'src/types/types';
import { In, Like, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Console } from 'console';
import { CreateRoomDto } from './createroomdto';
import { all } from 'axios';
import { Notif } from 'src/typeorm/entities/notif';
import { WebsocketService } from 'src/realtime/Websocketservice';
import { spec } from 'node:test/reporters';
import { AuthService } from 'src/auth/auth.service';
import { ChatService } from 'src/chat/chat.service';
import { UpdateRoomDto } from './updtateroomdto';
@Injectable()
export class RoomService {
  constructor(@InjectRepository(Room) private readonly roomrepository: Repository<Room>,private readonly authservice:AuthService,private readonly websocketService:WebsocketService,
    @InjectRepository(RoomMember) private readonly roommmemberrepository: Repository<RoomMember>,@InjectRepository(Notif) private readonly notifrepository : Repository<Notif>,private readonly chatservice:ChatService) {
  }
  async updatechatroom(myroom: Room) {
    await this.roomrepository.save(myroom);
  }
  async findroom(roomname: string) {
    const room = await this.roomrepository.findOneBy({ roomname });
    return room;
  }
  async findroomid(id: number) {
    const room = await this.roomrepository.findOneBy({ id });
    return room;
  }
  async findallrooms() {
    const room = await this.roomrepository.find();
    return room;
  }
  async findroommembers(roomname: string) {
    const room = await this.roomrepository.findOne({relations:["members"],where:{roomname:roomname}});
    return room;
  }
  async findPublicRoomsNotJoined(user: User) {
    const publicRooms = await this.roomrepository.find({
      relations: ['members'],
      where: {
        type: In(['public', 'protected']),

      }
    });
    const roomsNotJoined = publicRooms.filter(room => !room.members.some(member => member.id === user.id));
    const additionalrooms = await this.roommmemberrepository.find(
      { 
        relations: ['room'], where: { 
          user: user,
          acceptedtojoin: false
        }
      })
    for (let i = 0; i < additionalrooms.length; i++) {
      roomsNotJoined.push(additionalrooms[i].room);
    }

    return roomsNotJoined;
  }
  async findPublicRoomsJoined(user: User) {
    const publicRooms = await this.roomrepository.find({
      relations: ['members'],
    });
    
    const filteredRooms = await Promise.all(publicRooms.map(async (room) => {
      const isMember = room.members.some(member => member.id === user.id);
      if (isMember) {
        const status = await this.getstatusofthemember(room, user);
        if(!status)
          return true;
        if(status.acceptedtojoin == false)
          if(status.status !== "banned")
            return false;
        return status.status !== "banned";
      }
      return false; 
    }));

    const roomsNotBanned = publicRooms.filter((room, index) => filteredRooms[index]);
   
    const roomsjoinedwithroles = await Promise.all(roomsNotBanned.map(async (room) => {
      const memberStatus = await this.getstatusofthemember(room, user);
      const chatid = await this.chatservice.findChatByroomid({friends:null,rooms:room});
      if(chatid)
      {
        const lastmessage = await this.chatservice.findMessagesByChatId(chatid.id);
      
        const lastm =lastmessage[lastmessage.length - 1] ? lastmessage[lastmessage.length - 1].content : null;
        const role = memberStatus ? memberStatus.role : null;
        const status = memberStatus ? memberStatus.status : null;
      
        return {
            id: room.id,
            name: room.roomname,
            type: room.type,
            members: await this.getstatusofallthemember(room, user.id),
            me: role,
            mestatus :status,
            lastmessagecontent:lastm,
        };
      }
      
  }));
    
    return roomsjoinedwithroles;
  }
  async getstatusofallthemember(room:Room,userid:number) 
  {
    
      const allmembers = await this.roommmemberrepository.find({relations:["user"],where:{
        room:room,acceptedtojoin:true
  }})
  const members = []; 

allmembers.forEach((mem) => {
  if (mem.user.id != userid) {
    members.push({ 
      id: mem.user.id,
      avatar: mem.user.avatar,
      login: mem.user.login,
      role: mem.role,
      status:mem.status,
    });
  }
});
  
   return members;

  }
  async ubdateroom(room:Room,roomdetails:RoomDtails)
  {
    room.roomname = roomdetails.roomname;
    room.type = roomdetails.type;
    if(room.type == "protected")
    {
      room.password =  await this.hashPassword(roomdetails.password);;
    }
    return this.roomrepository.save(room);
  }
  async leaveroom(roomname: string, user: User,username:string = "") {

    const room = await this.roomrepository.findOne({ where: { roomname: roomname }, relations: ['members'] });

    if (user && room) {
      room.members = room.members.filter(member => member.id !== user.id);
      const mymy = await this.findromewithrole({ room: room, user: user });
      if (mymy.role == "owner")
      {
        const newowner = await this.authservice.findUserbylogin(username);
        if(newowner && newowner.login != user.login)
        {
          const member = await this.roommmemberrepository.findOne({where:{
            user:newowner,room:room,
          }});
          if(member)
          {
            member.role = "owner";
          }
          await this.roommmemberrepository.save(member);
        }
        else
        {

          this.websocketService.emiterrorToUser(user.id.toString(),`error`);
          return null;

        }

      }
      const deleted = await this.roommmemberrepository.delete({ id: mymy.id });
      await this.roomrepository.save(room);
      return "deleted";
    }
  }
  async createroom(roomdto: CreateRoomDto, user: User) {

    try {
      const myrooom = this.roomrepository.create(roomdto);

      await this.roomrepository.save(myrooom);

      const rooms = await this.roomrepository.findOne({ where: { roomname: myrooom.roomname }, relations: ['members'] });


      rooms.members.push(user);
      return this.roomrepository.save(rooms);
    }
    catch (e) {
      return null;
    }

  }
  async joinusertoroom(room: Room, user: User) {
    if (room.type == "private") {
    

      const already = await this.roommmemberrepository.findOne({
        where: {
          room: room, user: user,
        }
      })
      if (already) {
      
        already.acceptedtojoin = true;
        return await this.roommmemberrepository.save(already);
      }
    }

    await this.roomrepository
      .createQueryBuilder()
      .relation(Room, 'members')
      .of(room)
      .add(user);

    const roomMember = new RoomMember();
    if (room.type == "private") {
      roomMember.acceptedtojoin = false
    }
    roomMember.user = user;
    roomMember.room = room;
    const member = await this.createmember(roomMember);
  }
  async findromewithrole(details: RoomMemberDtails) {
    return await this.roommmemberrepository.findOneBy(details);
  }
  async createmember(roommember: RoomMember) {
    const member = await this.roommmemberrepository.create(roommember);
    return this.roommmemberrepository.save(member);

  }
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
  async muteuser(myroom: Room, muteduser: User, willingtomute: User) {
    const muter = await this.roommmemberrepository.findOne({
      where: {
        room: myroom, user: willingtomute,
      }
    })
    if (muter.role == "admin" || muter.role == "owner") {
      const specificuser = await this.roommmemberrepository.findOne({
        where: {
          room: myroom, user: muteduser,
        }
      })
      if(specificuser)
        {
          if (specificuser?.role != "owner" || muter?.role == "owner")
            specificuser.status = "muted";
          this.roommmemberrepository.save(specificuser)
        }
     
    }

    return;
  }
  async unmuteuser(myroom: Room, muteduser: User, willingtomute: User) {
    const muter = await this.roommmemberrepository.findOne({
      where: {
        room: myroom, user: willingtomute,
      }
    })
    if (muter?.role == "admin" || muter?.role == "owner") {
      const specificuser = await this.roommmemberrepository.findOne({
        where: {
          room: myroom, user: muteduser,
        }
      })
      if(specificuser) 
      {
        if (specificuser?.role != "owner" || muter?.role == "owner")
          specificuser.status = null;
        this.roommmemberrepository.save(specificuser)
      }
      
    }

    return;
  }
  async kickuser(myroom: Room, kickeduser: User, willingtokick: User) {
    const kicker = await this.roommmemberrepository.findOne({
      where: {
        room: myroom, user: willingtokick,
      }
    })
    if (kicker?.role == "admin" || kicker?.role == "owner") {
      const specificuser = await this.roommmemberrepository.findOne({
        where: {
          room: myroom, user: kickeduser,
        }
      })
      if (specificuser && specificuser.role != "owner")
      {
      if (specificuser &&( kicker?.role == "owner" ||(kicker?.role == "admin" && specificuser?.role != "admin")))
        await this.leaveroom(myroom.roomname, kickeduser);
      }
    }

    return;
  }
  async getstatusofthemember(myroom: Room, user: User) {
    const member = await this.roommmemberrepository.findOne({
      where: {
        room: myroom, user: user,
      }
    });
    return member;
  }
 
  async banuser(myroom: Room, kickeduser: User, willingtokick: User) {
    const kicker = await this.roommmemberrepository.findOne({
      where: {
        room: myroom, user: willingtokick,
      }
    })
    if (kicker.role == "admin" || kicker.role == "owner") {
      const specificuser = await this.roommmemberrepository.findOne({
        where: {
          room: myroom, user: kickeduser,
        }
      })
      if (specificuser && specificuser.role != "owner")
      {
        if(kicker.role == "owner" ||(kicker.role == "admin" && specificuser.role != "admin"))
          specificuser.status = "banned";
        this.roommmemberrepository.save(specificuser)
      }
    } 

    return;
  }
  async unbanuser(myroom: Room, kickeduser: User, willingtokick: User) {
    const kicker = await this.roommmemberrepository.findOne({
      where: {
        room: myroom, user: willingtokick,
      }
    })
    if (kicker.role == "admin" || kicker.role == "owner") {
      const specificuser = await this.roommmemberrepository.findOne({
        where: {
          room: myroom, user: kickeduser,
        }
      })
      if(specificuser)
        {
          if (specificuser?.role != "owner")
            specificuser.status = null;
          this.roommmemberrepository.save(specificuser)
        }
      
    }

    return;
  }

  async setadmin(myroom: Room, useradmin: User, willingtoset: User) {
    const willing = await this.roommmemberrepository.findOne({
      where: {
        room: myroom, user: willingtoset,
      }
    })
    if (willing.role == "admin" || willing.role == "owner") {
      const specificuser = await this.roommmemberrepository.findOne({
        where: {
          room: myroom, user: useradmin,
        }
      })

      if (specificuser.role != "owner")
        specificuser.role = "admin";
      this.roommmemberrepository.save(specificuser)
    }

    return;
  }
  async unsetadmin(myroom: Room, useradmin: User, willingtoset: User) {
    const willing = await this.roommmemberrepository.findOne({
      where: {
        room: myroom, user: willingtoset,
      }
    })
    
    if ( willing.role == "owner") {
      const specificuser = await this.roommmemberrepository.findOne({
        where: {
          room: myroom, user: useradmin,
        }
      })
      if (specificuser.role != "owner")
        specificuser.role = "default";
      this.roommmemberrepository.save(specificuser)
    }

    return;
  }

  async userExistInRoom(room: Room, user: User): Promise<boolean> {
    const roomWithMembers = await this.roomrepository.findOne({
      relations: ["members"],
      where: {
        roomname: room.roomname,
      },
    });

    if (!roomWithMembers) {
      return false;
    }

    for (const member of roomWithMembers.members) {
      if (member.id === user.id) {
        return true;
      }
    }
    return false;
  }
  async updatenroomotification(user:User,roomname:string):Promise<void>
  {
    let readednotif;
   
   
    const room = await this.roomrepository.findOneBy({roomname:roomname});
    readednotif = await this.notifrepository.find({where:{
      user:user,isReaded:false,room:room,
    }});   
    
    for(const notif of readednotif){
      notif.isReaded = true;
    }
    await this.notifrepository.save(readednotif);
   
  
  }
  async getroomnotifications(user: User) {
    const notif = await this.notifrepository.find({
        relations: ["room"],
        where: {
            user: user,
            isReaded: false,
            type: "roommessage"
        }
    });
    const groupedNotifications = {};
    notif.forEach(not => { 
        const roomname = not.room.roomname;
        if (groupedNotifications[roomname]) {
            groupedNotifications[roomname].count++;
        } else {
            groupedNotifications[roomname] = {
                roomname: roomname,
                count: 1
            };
        }
    });
    const notificationsArray = Object.values(groupedNotifications);
    
    return notificationsArray;
}

async findroommembersautocom(roomname:string , str:string)
  {
    const room = await this.roomrepository.findOne({relations:["members"],where:{roomname:roomname,members:{login : Like(`${str}%`)}}});
    return room;
  }

}

