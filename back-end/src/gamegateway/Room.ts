import { Socket } from "socket.io";

export class Room{
    name : string;
    client1 : Socket;
    client2 : Socket;
    client1Name : string;
    client2Name : string;
    client1Avatar : string;
    client2Avatar : string;
    constructor(name : string){
        this.name = name;
    }
}