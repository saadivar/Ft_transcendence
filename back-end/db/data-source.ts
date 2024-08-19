import { DataSource, DataSourceOptions } from "typeorm";
import { User } from "src/typeorm/entities/User";
import { Acheivment } from "src/typeorm/entities/acheivment";
import { Room } from "src/typeorm/entities/rooms";
import { RoomMember } from "src/typeorm/entities/RoomMember";
import { Blocked } from "src/typeorm/entities/blocked";
import { Chat } from "src/typeorm/entities/chat";
import { Friends } from "src/typeorm/entities/friends";
import { Game } from "src/typeorm/entities/game";
import { Message } from "src/typeorm/entities/message";
import { Notif } from "src/typeorm/entities/notif";

export const datasourceoptions : DataSourceOptions ={
    type:'postgres',
    host: `${process.env.DB_HOST}`,
    port: Number(`${process.env.DB_PORT}`),
    username: `${process.env.POSTGRES_USER}`,
    password: `${process.env.POSTGRES_PASSWORD}`,
    database: `${process.env.POSTGRES_DB}`,
    entities: [User,Friends,Chat,Message,Blocked,Room,RoomMember,Notif,Game,Acheivment],
    migrations:['dist/db/migrations/*.js']
}


const dataSource = new DataSource(datasourceoptions);
export default dataSource;