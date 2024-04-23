import React, { useEffect, useState } from 'react'
import "./Rooms.css"
import { useSocket } from '../../../Socket';
import axios from "axios";
import CodeModal from '../../../Modals/RoomCode/RoomCode';
import romImg from '../../../../assets/groupImg.png'
interface Room {
  id: string;
  type: string;
  roomname: string;
  lastmessagecontent: string;
  name: String;
}


interface RoomsProps {
  Roomsdata: Room[];
  selectedroom: Room | null;
  RoomSelect: (room: any) => void;
  NotRoomsdata: Room[];
  RoomNotifs: { count: number; roomname: String;}[] | null;
  SetMessagesRoom: React.Dispatch<React.SetStateAction<any>>;
}
const Rooms = ({Roomsdata, selectedroom, RoomSelect, NotRoomsdata, RoomNotifs , SetMessagesRoom} : RoomsProps) => {


  const socket = useSocket();

  // userSelect(null)
  const [showPass, SetShow] = useState(false);
  const [Pass, SetPass] = useState('');
  const [joined, Setjoined] = useState<Room | null>(null);

  
  const Joinroom = async (room : Room) => {
    if (room.type !== 'protected') {
        socket?.emit("newmemberinroom", { name: room.roomname, password: '' });
      } else if (room.type === 'protected') {
        Setjoined(room);
        SetShow(true);
      }
  }


  const handleroomClick = (room: Room) => {
    if( selectedroom && room.name !== selectedroom.name){
      SetMessagesRoom(null);
      socket?.emit('chatroomdeselected', selectedroom.name);
    }
    if (selectedroom && selectedroom.name != room.name)
      SetMessagesRoom(null);
    // setSelectedroom(room);
    RoomSelect(room);
    socket?.emit('notifroom', room.name);
    socket?.emit('chatroomselected', room.name);
  };
    

    useEffect(() => {

        const memberLeaved = () => {
      
          socket?.on('ileaved', () => {
              RoomSelect(null);
              selectedroom &&  socket?.emit('chatroomdeselected', selectedroom.name);
            }
          );
          
        };

        memberLeaved();

        return () => {
          socket?.off('ileaved');
        };

    }, [socket]);

    if (selectedroom && Roomsdata) {

      const updatedRoom = Roomsdata.find(room => room.id === selectedroom.id);
      if (updatedRoom) {
          RoomSelect(updatedRoom); 
      }
    }
   
    const handleFormSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        try {
          if (joined) {
            socket?.emit("newmemberinroom", { name: joined.roomname, password: Pass });
            SetShow(false);
            SetPass("");
          }
        } catch (error) {
        }
      };
    
      const handleCancel = () => {
        SetShow(false);
        SetPass("");
      };
    

  return (
    <div className='roomsContainer'>
      <div className="joined_room">

        {Roomsdata && Roomsdata.map((room) => (
          <div 
            className={`discussion ${selectedroom != null && room.id === selectedroom.id ? 'message-active' : ''}`}
            onClick={() => handleroomClick(room)}
            key={room.id}
          >
            <div className="amis-image">
              <img src={romImg} />
            </div>

            <div className="amis-infos">
              <div className="amis-name"><p>{room.name}</p></div>
              <div className="last-message">{room.lastmessagecontent}</div>
            </div>

            <div className='room-type'>
                {room.type}
            </div>
            {
              RoomNotifs && (RoomNotifs.find(notification => notification.roomname === room.name)?.count ?? 0) > 0 &&
              <div className="room-notifications">
                {
                   RoomNotifs && RoomNotifs.find(notification => notification.roomname === room.name)?.count > 9
                    ? "+9"
                    : RoomNotifs.find(notification => notification.roomname === room.name)?.count
                }
              </div>
            }
          </div>
        ))}
      </div>
      <div className="notjoined_room">
      <p className='notjoind-title'>available rooms</p>
      {
        NotRoomsdata && NotRoomsdata.map((room) => 
        (
          <div className="discussion" key={room.id}>
              <div className="amis-image">
                  <img src={romImg}/>
              </div>
    

              <div className="amis-infos">
                  <div className="amis-name"><p>{room.roomname}</p></div>
              </div>
              <div className="join-room" onClick={() => Joinroom(room)}> join </div>
              </div>
        ))
      }
       {showPass && <CodeModal password={Pass} setPassword={SetPass} onSubmit={handleFormSubmit} onCancel={handleCancel} />}
      </div>
    </div>
  )
}

export default Rooms