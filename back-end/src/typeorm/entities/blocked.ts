import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "./User";
import { Chat } from "./chat";



@Entity()
@Unique(["user1", "user2"])
export class Blocked{
    @PrimaryGeneratedColumn()
    id: number;
    @ManyToOne(()=>User,(user)=>user.blocked1)
    user1:User;
    @ManyToOne(()=>User,(user)=>user.blocked2)
    user2:User;
}