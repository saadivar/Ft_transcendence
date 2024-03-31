import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Friends } from "./friends";
import { Chat } from "./chat";
import { Message } from "./message";
import { User } from "./User";
import { RoomMember } from "./RoomMember";
import { Notif } from "./notif";




@Entity()
@Unique(['roomname'])
export class Room {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    roomname: string;
    @Column({ type: 'enum', enum: ['public', 'protected', 'private'], default: 'public' })
    type: 'public' | 'protected' | 'private';
    @Column({ nullable: true }) 
    password: string;
    @OneToOne(() => Chat, (chat) => chat.rooms, { onDelete: 'CASCADE' })
    // @JoinColumn()
    chat: Chat;
    @ManyToMany(() => User, { cascade: true })
    @JoinTable({
        name: 'room_members',
        joinColumn: { name: 'room_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
    })
    members: User[];
    @OneToMany(() => RoomMember ,(roommember) => roommember.room)
    roommember: RoomMember;
    @OneToMany(() => Notif, (notifroom) => notifroom.room)
    notifroom: Notif[];
}
