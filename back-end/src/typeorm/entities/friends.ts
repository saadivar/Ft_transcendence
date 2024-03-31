import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "./User";
import { Chat } from "./chat";
import { v4 as uuidv4 } from 'uuid';



@Entity()
@Unique(["user1", "user2"])
export class Friends{
    @PrimaryGeneratedColumn()
    id: number;
    @ManyToOne(()=>User,(user)=>user.friends1, {onDelete: 'CASCADE' })
    user1:User;
    @ManyToOne(()=>User,(user)=>user.friends2, {onDelete: 'CASCADE' })
    user2:User;
    @Column({ default: false })
    isAccepted: boolean;
    // @Column({default:uuidv4()})
    // token:string;
    @OneToOne(() => Chat, (chat) => chat.friends, { onDelete: 'CASCADE' })
    // @JoinColumn()
    chat: Chat;
}