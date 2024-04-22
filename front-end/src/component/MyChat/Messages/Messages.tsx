import React, { useEffect, useState, useRef } from 'react'
import "./Messages.css"
import axios from 'axios';
import Input from "./inputPart/Input"
import Profile from '../../Profile/Profile';
import { Socket } from 'socket.io-client';
import { useSocket } from '../../Socket';

import grpImg from '../../../assets/groupImg.png'


interface Message {
    senderId: number;
    content: string;
    senderavatar: string;
}

interface User {
id: number;
avatar: string;
login: string;
status: any;
}

interface Room {
name: string;
mestatus: string;
}

interface MessagesProps {
optionSelected: any;
room: Room | null;
user: User | null;
profile: any;
MessagesData: Message[] | null;
MessagesRoom: Message[] | null;
}


const Messages = ({optionSelected ,room, user, profile, MessagesData, MessagesRoom} : MessagesProps) => {

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesRoomEndRef = useRef<HTMLDivElement>(null);
    const socket = useSocket()
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [MessagesData]); 


    useEffect(() => {
        messagesRoomEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, [MessagesRoom]); 

    const [stat, setstat] = useState(false);

    useEffect(()=>{
        socket?.on('muted', setstat)
    }, [socket])

  return (

    <div className='messages-container'> 
        {
            user ? (
            <>
                <div className= 'headPart'> 
                    {
                        user && 
                        <>
                            <div className="img-cont">
                                <img  src={user.avatar}/>
                            </div >

                            <div className="text">
                                <p className='friend-nm'>{user.login}</p>
                                <p className='friend-stat'>{user.status}</p>
                            </div>
                        </>
                    }

                </div>

                <div className= 'midlePart' key={user.id} > 
                    
                    <div className="new-chat"  >
                        { MessagesData && MessagesData.map((message , index) => (
                            
                                <div
                                    key={index}
                                    className={`usermessage ${message.senderId === user.id ? 'stark' : 'parker'}`}>
                                    {message.content}
                                </div>
                            ))   
                        }
                        <div className="nwestMessages" ref={messagesEndRef}></div>
                    </div>
                
                </div>
                
                <Input
                    User={user} 
                    Room={room} 
                    Profile={profile}/>
            </>
          )
           : (room) ? (
            <> 
                <div className= 'headPart'> 
                    {
                        room && 
                        <>
                            <div className="img-cont">
                                <img src={grpImg} />
                            </div >

                            <div className="text">
                                <p className='friend-nm'>{room.name}</p>
                              
                            </div>
                        </>
                    }

                </div>

                <div className= 'midlePart'> 
                    
                    <div className="new-chat">
                    
                        {
                            MessagesRoom && MessagesRoom.map((message, index) => (
                            <div key={index} className={`message-row ${message.senderId !== profile.id ? 'other' : 'mine'}`}>
                                {
                                    (message.senderId !== profile.id ? <img src={message.senderavatar} alt="sender" className="sender-img" /> : null)
                                }
                                <div key={index} className={`message ${message.senderId === profile.id ? 'othermsg' : 'mymsg'}`}>
                                    {message.content}
                                </div>
                                
                            </div> ))
                        }
                        <div className="nwestMessages" ref={messagesRoomEndRef}></div>
                    
                    </div>
                
                </div>
                
                {
                    room.mestatus != 'muted' && ( <Input
                        User={user}
                        Room={room} 
                        Profile={profile}
                    />
                    )
                }
            </>
          )
          : (<div className='No-conv'> <p> Select New Conversation Please </p> </div>)
        }

    </div>

  )
}

export default Messages