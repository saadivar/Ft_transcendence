import { useState, useEffect } from "react"
import React  from 'react'
import "./friends.css"



interface Friend {
  id: number;
  login: string;
  avatar: string;
  status: string;
  lastmessagecontent: string;
}

interface FriendsDiscussionProps {
  friendsData: Friend[];
  selectedUser: Friend | null;
  userSelect: (friend: Friend) => void;
  SetNotifs: React.Dispatch<React.SetStateAction<any[]>>;
  SetMessagesById: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  Notifs: any[];
  SetMessages: React.Dispatch<React.SetStateAction<any[] | null>>;
  MesagesById: Record<number, number>;
  selectedFriendId: number | null;
  setSelectedFriendId: React.Dispatch<React.SetStateAction<number | null>>;
}



const Friends_discusion = ({
  friendsData ,
  selectedUser,
  userSelect, 
  SetNotifs,
  Notifs,
  SetMessages,
  MesagesById,
  SetMessagesById,
  selectedFriendId,
  setSelectedFriendId
} : FriendsDiscussionProps) => {

  const handleFriendClick = (friend: Friend, friendId: number) => {
    if (selectedUser && selectedUser.id != friend.id)
      SetMessages(null);
    setSelectedFriendId(friendId);
    userSelect(friend);
    SetMessagesById((prevMessagesById ) => {
      const updatedMessages = { ...prevMessagesById };
      delete updatedMessages[friendId];
      return updatedMessages;
    });
    SetNotifs((prevNotifs) => prevNotifs.filter(notif => notif.senderid !== friendId));
    
  };
  

  return ( 
    <div>
      {friendsData && friendsData.map((friend) => (
        <div
          key={friend.id}
          className={`discussion ${friend.id === selectedFriendId ? 'message-active' : ''}`}
          onClick={() => handleFriendClick(friend ,friend.id)}
        >
          <div className="amis-image">
            <img  src={friend.avatar}></img>
            {friend.status === 'online' ? <span className="on"></span> : friend.status === 'ingame' ? <span className="ingame"></span> : <span className="off"></span>}
          </div>
          <div className="amis-infos">
            <div className="amis-name"> <p>{friend.login}</p></div>
            <p className="last-message">{friend.lastmessagecontent}</p>
          </div>
          { 
            friend.id !== selectedFriendId && 
            MesagesById[friend.id] > 0 && 
            <div className="amis-notifications"> {MesagesById[friend.id] > 9 ? "+9" : MesagesById[friend.id]}</div>
          }
        </div>
      ))}
    </div>
  );
};

export default Friends_discusion;

