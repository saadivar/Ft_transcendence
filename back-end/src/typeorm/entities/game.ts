import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Friends } from "./friends";
import { Chat } from "./chat";
import { Message } from "./message";
import { Blocked } from "./blocked";
import { Room } from "./rooms";
import { Notif } from "./notif";
import { User } from "./User";


@Entity()

export class Game {

    @PrimaryGeneratedColumn()
    id: number;
    @ManyToOne(()=>User,(user)=>user.player1, { onDelete: 'CASCADE'})
    player1:User;
    @ManyToOne(()=>User,(user)=>user.player2, { onDelete: 'CASCADE'})
    player2:User;
    @Column()
    score1:number;
    @Column()
    score2:number;
    @ManyToOne(() => User, (user) => user.winner, { onDelete: 'CASCADE'})
    @JoinColumn()
    winner : User;
    @ManyToOne(() => User, (user) => user.loser, { onDelete: 'CASCADE'})
    @JoinColumn()
    loser : User;
}