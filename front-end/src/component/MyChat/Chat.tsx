import React, { useState, useEffect, useRef } from "react";
import MenuBar from "../PunkProfile/MenuBar/MenuBar";
import "./Chat.css";
import My_profile from "./my_profile/My_profile";
import Messages from "./Messages/Messages";
import PingIcon from "../../assets/pingIcon.svg"
import FriendInfo from "./InfosPart/friendInfos/FriendInfo";
import RoomInfo from "./InfosPart/roomInfos/OwnerInfos/OwnerInfo";
import { useSocket } from "../Socket";

import axios from "axios";


const Chat = ({user}) => {
 
  const socket = useSocket()
  const [User, SetUser] = useState(null);
  const [Room, SetRoom] = useState(null);


  const handleUser = (user) => {
    SetUser(user);
  }
  const handleRoom = (room) => {
    SetRoom(room);
  }

  const [MyProfile, SetProfile] = useState(null);


  const handleProfile = (profile) => {
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
              console.log(error)
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
                console.log(error)
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

      {user && <MenuBar user={user}/>}
    </div>
  );
};

export default Chat;
