import React, { useState, useEffect, useRef, Dispatch } from "react";
import MenuBar from "../PunkProfile/MenuBar/MenuBar";
import "./Chat.css";
import My_profile from "./my_profile/My_profile";
import Messages from "./Messages/Messages";

import FriendInfo from "./InfosPart/friendInfos/FriendInfo";
import RoomInfo from "./InfosPart/roomInfos/OwnerInfos/OwnerInfo";
import { useSocket } from "../Socket";

import axios from "axios";

interface User {
  id : number;
  isTwoFactorAuthenticationEnabled : boolean
  avatar: string;
  login: string;
  status: string;
}

interface Member {
  id: string;
  role: string;
  status: string;
  login: string;
  avatar: string;
}

interface Room {
  id: string;
  type: 'public' | 'private' | 'protected';
  password: string;
  roomname: string;
  lastmessagecontent: string;
  name: string;
  mestatus: string;
  members:Member[]
  me:string
}

interface Profile {

}

interface ChatProps {
  user : User | null ;
  setUser : React.Dispatch<React.SetStateAction<null>>
}

const Chat = ({user, setUser} :ChatProps) => {
 
  const socket = useSocket()
  const [User, SetUser] = useState<User | null>(null);
  const [Room, SetRoom] = useState<Room | null>(null);


  const handleUser = (user : User) => {
    SetUser(user);
  }
  const handleRoom = (room: Room) => {
    SetRoom(room);
  }

  const [MyProfile, SetProfile] = useState<Profile | null>(null);


  const handleProfile = (profile: Profile) => {
    SetProfile(profile);
  }

  const [optionSelected, SetOption] = useState("friends");
  const [MessagesData, SetMessages] = useState(null);
  const [FetchMessages, SetFetch] = useState(0);
 
    useEffect(() => {
      const getMessages  = async () => {
          try 
          {
              if (User) {
                  const resp = await axios.post(`${import.meta.env.VITE_url_back}/api/chat/getconversation`,{id: User.id},  {withCredentials: true})
                  SetMessages(resp.data);
                  socket.emit('notif',{type:"message",senderid: User.id})
              }
          }
          catch(error){
          }
      }
      getMessages();
    }
  , [User, FetchMessages]);
   
    useEffect(() => {
        socket?.on('message', ()=> {
            SetFetch((prevIsBool) => prevIsBool + 1)
            
        });
        return () => {
            socket?.off('message');
        };
    }, [socket]);


  

    const [MessagesRoom, SetMessagesRoom] = useState(null);
    const [FetchMessagesRoom, SetFetchRoom] = useState(0);
    useEffect(() => {
        const getMessages  = async () => {
            try 
            {
                if (Room) {
                  
                    const resp = await axios.post(`${import.meta.env.VITE_url_back}/api/chat/getroomconversation`,{roomname: Room.name},  {withCredentials: true})
                    SetMessagesRoom(resp.data);
                    socket.emit('roomnotif', Room.name)
                }
            }
            catch(error){
                (error)
            }
        }
        getMessages();
       }
    , [Room, FetchMessagesRoom]);
       
    useEffect(() => {
        socket?.on('roomchat', ()=> {
            SetFetchRoom((prevIsBool) => prevIsBool + 1)
            
    });
      return () => {
        socket?.off('roomchat');
      };
    }, [socket]);



  return (
    <div className="chat-container">
      <div className="chat">
        
        <My_profile 
          UserSelceted={handleUser} 
          RoomSelceted={handleRoom}
          selectedUser={User}
          selectedroom={Room}
          Profile={handleProfile}
          optionSelected={optionSelected} 
          SetOption={SetOption}
          SetMessages={SetMessages}
          SetMessagesRoom={SetMessagesRoom}
          />
     
        <Messages 
          optionSelected={optionSelected} 
          room={Room}
          user={User}
          profile={MyProfile}
          MessagesData={MessagesData}
          MessagesRoom={MessagesRoom}
        />

        <div className="OtherProfile">
          {
            optionSelected === "friends" ? (

              <FriendInfo 
              user={User}
              profile={MyProfile}
              UserSelceted={handleUser} 
            />
            ) : optionSelected === "rooms" ? (
              <RoomInfo 
              profile={MyProfile}
              room={Room}
              RoomSelceted={handleRoom} 
              />)
              : (null)       
          }
        </div>
      </div>

      { user && <MenuBar user={user} setUser={setUser}/> }
    </div>
  );
};

export default Chat;
