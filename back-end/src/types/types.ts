import { User } from "src/typeorm/entities/User";
import { Chat } from "src/typeorm/entities/chat";
import { Friends } from "src/typeorm/entities/friends";
import { Message } from "src/typeorm/entities/message";
import { Room } from "src/typeorm/entities/rooms";

export type UserDetails={
    login:string;
    email:string;
    avatar:string;
}
export type FriendsDtails={
    user1:User;
    user2:User;
}
export type MessageDtails={
    content:string;
    sendr:User;
    chat:Chat;
}
export type ChatDtails={
    friends:Friends;
    rooms:Room;
}
export type BlockedDtails={
    user1:User;
    user2:User;
}
export type RoomDtails={
    roomname: string;
    type: 'public' | 'protected' | 'private';
    password:string;
}
export type RoomMemberDtails={
    room: Room;
    user:User
    
}
export type NotifDtails={
    type:  'pending' | 'message'|'roommessage';
    user:User;
    sender:User;
    room:Room;
    isReaded: boolean;
    
}

export type GameDetails={

    player1:User;
    player2:User;
    winner : User;
    loser : User;
}
