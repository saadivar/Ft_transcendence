import { useState, useEffect } from "react"
import React  from 'react'
import "./friends.css"
import { useSocket } from "../../../Socket";
// MessagebyId={MessagebyId}
// setMessageById={setMessagebyId}
const Friends_discusion = ({friendsData ,selectedUser,userSelect, SetNotifs, Notifs, SetMessages, SetTotal}) => {

  const [selectedFriendId, setSelectedFriendId] = useState(null);
  // console.log(friendsData);
  const socket = useSocket();
  const [MesagesById, SetMessagesById] = useState({});
  
  const handleFriendClick = (friend , friendId) => {
    if (selectedUser && selectedUser.id != friend.id)
      SetMessages(null);
    setSelectedFriendId(friendId);
    userSelect(friend);
    SetMessagesById((...prevMessagesById) => prevMessagesById.filter(notif => notif.senderid !== friendId));
    SetNotifs((prevNotifs) => prevNotifs.filter(notif => notif.senderid !== friendId));
    
  };
  
  useEffect(() => {
    let CountMessages = {};
    Notifs.forEach(notif => {
      const type = notif.type;
      const id = notif.senderid;

      if(id === selectedFriendId)
        SetNotifs((prevNotifs) => prevNotifs.filter(notif => notif.senderid !== selectedFriendId));
      if (type === "message" && id !== selectedFriendId)
        CountMessages[id] = (CountMessages[id] || 0) + 1;
    });
  
      SetMessagesById(CountMessages);

     
  }, [Notifs]);


  useEffect(() => {

    const messagesValues = Object.values(MesagesById);
    let totalNotifications = 0; 
    if (messagesValues.length > 0) 
    {
      for (let i = 0; i < messagesValues.length; i++) {
          totalNotifications += messagesValues[i];
      } 
    }
    SetTotal(totalNotifications);
  },[MesagesById])
  
  //  converts the object's values into an array
 


  return ( 
    <div>
      {friendsData && friendsData.map((friend) => (
        <div
          key={friend.id}
          className={`discussion ${friend.id === selectedFriendId ? 'message-active' : ''}`}
          onClick={() => handleFriendClick(friend ,friend.id)}
        >
          <div className="amis-image">
            <img  src={friend.avatar}/>
          </div>
          <div className="amis-infos">
            <p className="amis-name"> <p>{friend.login}</p></p>

            <p className="last-message">{friend.lastmessagecontent}</p>
          </div>
          {friend.id !== selectedFriendId && MesagesById[friend.id] > 0 && <div className="amis-status">{MesagesById[friend.id]}</div>}
        </div>
      ))}
    </div>
  );
};

export default Friends_discusion;

