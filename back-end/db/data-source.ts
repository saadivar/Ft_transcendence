import { Room } from "src/gamegateway/Room";
import { RoomMember } from "src/typeorm/entities/RoomMember";
import { User } from "src/typeorm/entities/User";
import { Acheivment } from "src/typeorm/entities/acheivment";
import { Blocked } from "src/typeorm/entities/blocked";
import { Chat } from "src/typeorm/entities/chat";
import { Friends } from "src/typeorm/entities/friends";
import { Game } from "src/typeorm/entities/game";
import { Message } from "src/typeorm/entities/message";
import { Notif } from "src/typeorm/entities/notif";
import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions ={
    type: 'postgres',
    host: 'postgres',
    port: 5432,
    username: 'postgres',
    password: 'saad',
    database: 'pingpong_db',
    entities: [User,Friends,Chat,Message,Blocked,Room,RoomMember,Notif,Game,Acheivment],
    migrations:['dist/db/migrations/*.js'],
    
};
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
