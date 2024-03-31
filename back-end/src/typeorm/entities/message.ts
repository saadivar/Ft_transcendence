
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Chat } from './chat';
import { User } from './User';


@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;
  @ManyToOne(() => User, (user) => user.messages, { onDelete: 'CASCADE' })
  sender: User;

  @ManyToOne(() => Chat, (chat) => chat.messages, { onDelete: 'CASCADE' })
  chat: Chat;
}
