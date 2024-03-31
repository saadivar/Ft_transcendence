import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';
import { Room } from './rooms';


@Entity()
export class Notif {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: [ 'pending', 'message',"roommessage"]})
    type:  'pending' | 'message'|'roommessage';
    @ManyToOne(() => User, (user) => user.notif, { onDelete: 'CASCADE' })
    user: User;
    @ManyToOne(() => User, (user) => user.notif, { onDelete: 'CASCADE' })
    sender: User;
    @ManyToOne(() => Room, (room) => room.notifroom, { onDelete: 'CASCADE' })
    room: Room;
    @Column()
    isReaded: boolean;
}