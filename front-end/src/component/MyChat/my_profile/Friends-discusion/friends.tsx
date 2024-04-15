import { useState, useEffect } from "react"
import React  from 'react'
import "./friends.css"
import { useSocket } from "../../../Socket";
// MessagebyId={MessagebyId}
// setMessageById={setMessagebyId}
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
}) => {

  const socket = useSocket();
  
  const handleFriendClick = (friend , friendId) => {
    if (selectedUser && selectedUser.id != friend.id)
      SetMessages(null);
    setSelectedFriendId(friendId);
    userSelect(friend);
    SetMessagesById((...prevMessagesById) => prevMessagesById.filter(notif => notif.senderid !== friendId));
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
            {friend.status === 'online' ? <span className="on"></span> : <span className="off"></span>}
          </div>
          <div className="amis-infos">
            <p className="amis-name"> <p>{friend.login}</p></p>

            <p className="last-message">{friend.lastmessagecontent}</p>
          </div>
          {friend.id !== selectedFriendId && MesagesById[friend.id] > 0 && <div className="amis-notifications">{MesagesById[friend.id]}</div>}
        </div>
      ))}
    </div>
  );
};

export default Friends_discusion;

