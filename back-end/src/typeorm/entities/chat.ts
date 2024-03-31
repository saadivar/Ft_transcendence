// chat.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { User } from "./User";
import { Message } from './message';
import { Friends } from './friends';
import { Room } from './rooms';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;


  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];

  @OneToOne(() => Friends, (friends) => friends.chat, { onDelete: 'CASCADE'})
  @JoinColumn()
  friends : Friends;
  @OneToOne(() => Room, (room) => room.chat, { onDelete: 'CASCADE'})
  @JoinColumn()
  rooms : Room;
}
