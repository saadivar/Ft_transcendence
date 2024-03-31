import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { User } from './User';
import { Room } from './rooms';

@Entity()
export class RoomMember {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, {onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Room,(room) => room.roommember, {onDelete: 'CASCADE' })
  room: Room;

  @Column({ type: 'enum', enum: ['owner', 'admin', 'default'], default: 'default' })
  role: 'owner' | 'admin' | 'default';
  @Column({ type: 'enum', enum: ['muted', 'banned'], nullable:true,default:null })
  status: 'muted' | 'banned' | null;
  @Column({default:true})
  acceptedtojoin: boolean;
}