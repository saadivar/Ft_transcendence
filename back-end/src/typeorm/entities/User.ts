import { Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Friends } from "./friends";
import { Chat } from "./chat";
import { Message } from "./message";
import { Blocked } from "./blocked";
import { Room } from "./rooms";
import { Notif } from "./notif";
import { Game } from "./game";
import { Acheivment } from "./acheivment";


@Entity({name: 'users'})

export class User {

    @PrimaryGeneratedColumn()
    id: number;
    @Column()//{unique:true}
    login: string
    @Column()
    email: string;
    @Column()
    avatar: string;
    @Column({ default: true })
    isNew: boolean;
    @Column({ nullable: true })
    twoFactorAuthenticationSecret: string;
    @Column( {type: 'enum', enum: ['online', 'offline', 'ingame'], default: 'offline'} )
    status: 'online' | 'offline' | 'ingame';
    @Column({ default: false })
    isTwoFactorAuthenticationEnabled: boolean;
    @Column({ default: true })
    HasAccess: boolean;
    
    @OneToMany(() => Friends, (friends) => friends.user1)
    friends1: Friends[];
    @OneToMany(() => Friends, (friends) => friends.user2)
    friends2: Friends[];
    @OneToMany(() => Game, (game) => game.player1)
    player1: Game[];
    @OneToMany(() => Game, (game) => game.player2)
    player2: Game[];
    @OneToMany(() => Blocked, (blocked) => blocked.user1)
    blocked1: Blocked[];
    @OneToMany(() => Blocked, (blocked) => blocked.user2)
    blocked2: Blocked[];
    @OneToMany(() => Message, (message) => message.sender)
    messages: Message[];
    @OneToMany(() => Acheivment, (acheivment) => acheivment.belongs)
    acheivment: Acheivment[];
    
    @OneToMany(() => Notif, (notif) => notif.user)
    notif: Notif[];
    @OneToMany(() => Notif, (notifsender) => notifsender.sender)
    notifsender: Notif[];
    @OneToMany(() => Game, (game) => game.winner, { onDelete: 'CASCADE' })
    winner: Game;
    @OneToMany(() => Game, (game) => game.loser, { onDelete: 'CASCADE' })
    loser: Game;
    
}






// @ManyToMany(() => Room, { cascade: true })
    // @JoinTable({
    //     name: 'room_members',
    //     joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    //     inverseJoinColumn: { name: 'room_id', referencedColumnName: 'id' },
    // })
    // rooms: Room[];