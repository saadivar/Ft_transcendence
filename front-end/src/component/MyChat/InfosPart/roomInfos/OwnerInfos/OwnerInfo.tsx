import React, { useEffect, useState } from 'react'
import "./OwnerInfo.css"
import "./owner.css"
import AddFriendModal from '../../../../Modals/addfriend/addfriend'
import SetOwnerModal from '../../../../Modals/Setowner/setowner'
import axios from 'axios'
import { useSocket } from '../../../../Socket'
import LogsModal from '../../../../Modals/LogsModal/LogsModal'
import SettingsRoom from '../../../../Modals/SettingsRoom/SettingsRoom'
import romImg from '../../../../../assets/groupImg.png'



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
  members:Member[]
}

interface OwnerProps {
  room: Room;
  RoomSelceted: any;
}

interface AdminProps {
  room: Room;
  RoomSelceted: any;
}

interface DefaultProps {
  room: Room;
  RoomSelceted: any;
}


interface RoomInfoProps {
  profile: any;
  room: Room | null;
  RoomSelceted: any;
}

function OwnerOption (roleSelected : any, SetRole: any, room: Room, memberSelectedid :any, RoomSelceted:any) 
{
  const socket = useSocket()

  const handleKick = () => {
    socket?.emit('kickuser', {id : memberSelectedid , name :  room.name});
    SetRole(null)
  }

  const handleMute = () => {
    socket?.emit('muteuser', {id : memberSelectedid , name :  room.name});
    SetRole(null)
  }

  const handleBan = () => {
    socket?.emit('banuser', {id : memberSelectedid , name :  room.name});
    SetRole(null)
  }

  if (roleSelected === 'default') {
  const SetAdmin = () => {
    socket?.emit('setadmin', {id : memberSelectedid , name :  room.name});
    SetRole(null)
    
  }


  return (
      <div className="owner-member">
        <div className="optowner kick" onClick={handleKick}>
          kick
        </div>
        <div className="optowner mute" onClick={handleMute}>
          mute
        </div>
        <div className="optowner ban" onClick={handleBan}>
          ban
        </div>
        <div className="optowner setadmin" onClick={SetAdmin}>
          admin
        </div>
      </div>
    )
  }

  if (roleSelected === 'admin') {

    const UnAdmin = () => {
      socket?.emit('unsetadmin', {id : memberSelectedid , name :  room.name});
      SetRole(null)
    }

    return (
      <div className="owner-member">
          <div className="optowner kick" onClick={handleKick}>
          kick
        </div>
        <div className="optowner mute" onClick={handleMute}>
          mute
        </div>
        <div className="optowner ban" onClick={handleBan}>
          ban
        </div>
        <div className="optowner setadmin" onClick={UnAdmin}>
          Unadmin
        </div> 
      </div>
    )
  }

}

function adminOption (roleSelected : any,SetRole: any, room: Room, memberSelectedid :any, RoomSelceted:any)
{

  if (roleSelected === 'default')
  {

    const socket = useSocket()

    const handleKick = () => {
      socket?.emit('kickuser', {id : memberSelectedid , name :  room.name});
      SetRole(null)
    }

    const handleMute = () => {
      socket?.emit('muteuser', {id : memberSelectedid , name :  room.name});
      SetRole(null)
    }

    const handleBan = () => {
      socket?.emit('banuser', {id : memberSelectedid , name :  room.name});
      SetRole(null)
    }
    return (
      <div className="friend-options">
        <div className="optowner kick" onClick={handleKick}>
          kick
        </div>
        <div className="optowner mute" onClick={handleMute}>
          mute
        </div>
        <div className="optowner ban" onClick={handleBan}>
          ban
        </div>
      </div>
    )
  }

  else 
  {
    return (
      <div className="friend-options">
        <div className='no-opt'><p>No options</p></div>
      </div>
    )
  }
}

function memberOption ()
{
  
  return (
    <div className="friend-options">
      <div className='no-opt'><p>No options</p></div>
    </div>
  )
}

function renderOptions(roleSelected : any, SetRole: any, room: Room, memberSelectedid: any, RoomSelceted:any) {
  if (!roleSelected) {
    return (
      <div className="friend-options">
        <div className='no-opt'><p>No options</p></div>
      </div>
    )
  }

  if (room.me === 'admin') 
    return (adminOption(roleSelected, SetRole,room, memberSelectedid, RoomSelceted));
  else if (room.me === 'owner') 
      return (OwnerOption(roleSelected, SetRole,room, memberSelectedid, RoomSelceted)) 
  else if (room.me === 'default') 
      return (memberOption())
}


const Owner = ({room, RoomSelceted} : OwnerProps) => {
  const [showAdd, setShowAdd] = useState(false);
  const [friendName, setFriendName] = useState("");
  const [NewOwner, setNewOwner] = useState("");
  const [showSetOwner, setShowSetOwner] = useState(false);
  const [ShowSettings, setShowSettings] = useState(false)
  const  socket = useSocket();

  const [showLogs, setShowLogs] = useState(false);

  const handleAddClick = () => {
    setShowAdd(true);
  };

  const handleLeaveClick = () => {
    setShowSetOwner(true);
  };

  const handlelogsClick = () => {
    setShowLogs(true);
  };

  const handleFormSubmit = async (e : React.FormEvent) => {
    const resp =  axios.post(`${import.meta.env.VITE_url_back}/api/room/inviteforprivateroom`, {username: friendName, name: room.name},{withCredentials: true})
    setShowAdd(false);
    setFriendName("");
   
  };

  const handleLeaveSubmit = () => {
    NewOwner.length > 0 && socket?.emit('userleaveroom', {name: room.name, newowner: NewOwner});
    RoomSelceted(null);
    setShowSetOwner(false);
    setNewOwner("");
  };

  const handleCancel = () => {
    setShowAdd(false);
    setFriendName("");
    setNewOwner("")
    setShowSetOwner(false);
    setShowLogs(false);
  };

  const handleSettingsClick = () =>{
    setShowSettings(true);
  }
  
  return (
    <>
      {
        room.type == 'private' &&
        <div className='addowner own' onClick={handleAddClick}>add</div>
      }
      <div className='leaveowner own' onClick={handleLeaveClick}>leave</div>
      <div className='logsowner own' onClick={handlelogsClick}>logs</div>
      <div className='roomSettings own' onClick={handleSettingsClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ai ai-Gear"
          >
            <path d="M14 3.269C14 2.568 13.432 2 12.731 2H11.27C10.568 2 10 2.568 10 3.269v0c0 .578-.396 1.074-.935 1.286-.085.034-.17.07-.253.106-.531.23-1.162.16-1.572-.249v0a1.269 1.269 0 0 0-1.794 0L4.412 5.446a1.269 1.269 0 0 0 0 1.794v0c.41.41.48 1.04.248 1.572a7.946 7.946 0 0 0-.105.253c-.212.539-.708.935-1.286.935v0C2.568 10 2 10.568 2 11.269v1.462C2 13.432 2.568 14 3.269 14v0c.578 0 1.074.396 1.286.935.034.085.07.17.105.253.231.531.161 1.162-.248 1.572v0a1.269 1.269 0 0 0 0 1.794l1.034 1.034a1.269 1.269 0 0 0 1.794 0v0c.41-.41 1.04-.48 1.572-.249.083.037.168.072.253.106.539.212.935.708.935 1.286v0c0 .701.568 1.269 1.269 1.269h1.462c.701 0 1.269-.568 1.269-1.269v0c0-.578.396-1.074.935-1.287.085-.033.17-.068.253-.104.531-.232 1.162-.161 1.571.248v0a1.269 1.269 0 0 0 1.795 0l1.034-1.034a1.269 1.269 0 0 0 0-1.794v0c-.41-.41-.48-1.04-.249-1.572.037-.083.072-.168.106-.253.212-.539.708-.935 1.286-.935v0c.701 0 1.269-.568 1.269-1.269V11.27c0-.701-.568-1.269-1.269-1.269v0c-.578 0-1.074-.396-1.287-.935a7.755 7.755 0 0 0-.105-.253c-.23-.531-.16-1.162.249-1.572v0a1.269 1.269 0 0 0 0-1.794l-1.034-1.034a1.269 1.269 0 0 0-1.794 0v0c-.41.41-1.04.48-1.572.249a7.913 7.913 0 0 0-.253-.106C14.396 4.343 14 3.847 14 3.27v0z" />
            <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
          </svg>
       
      </div>
      {

        showAdd &&
        <AddFriendModal
          friendName={friendName}
          setFriendName={setFriendName}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      }
      {
      showSetOwner 
      &&
      <SetOwnerModal
        room={room}
        NewOwner={NewOwner}
        setNewOwner={setNewOwner}
        onSubmit={handleLeaveSubmit}
        onCancel={handleCancel}
      />
    }
      {
        showLogs && 
        <LogsModal
            room={room}
            onCancel={handleCancel}
        />
      }

      {ShowSettings && <SettingsRoom  setShowSettings={setShowSettings} room={room}/>}
    </>
  );
};

const Admin = ({room, RoomSelceted} : AdminProps) => {
  const socket = useSocket()

  const handleLeaveClick = () => {
    socket?.emit('userleaveroom', {name: room.name, newowner:''});

    RoomSelceted(null);
  };

  return (
      <div className='leaveowner own' onClick={handleLeaveClick}>leave</div>
  );
};

const Default = ({room, RoomSelceted} : DefaultProps) => {
  const socket = useSocket()

  const handleLeaveClick = () => {
    socket?.emit('userleaveroom', {name: room.name, newowner:''});
    RoomSelceted(null);
  };

  return (
      <div className='leaveowner own' onClick={handleLeaveClick}>leave</div>
  );
};

function MyOptions(room: Room , roomRole : string, RoomSelceted :any) {
  
  if (roomRole === 'owner') 
  {
    return(
      <Owner room={room} RoomSelceted={RoomSelceted}/>
    )
  }

  else if (roomRole === 'admin') 
  {
    return(
      <Admin room={room} RoomSelceted={RoomSelceted}/>
    )
  }
  
  else if (roomRole === 'default') 
  {
    return(
      <Default room={room} RoomSelceted={RoomSelceted}/>
    )
  }

}


const RoomInfo = ({profile, room, RoomSelceted} : RoomInfoProps) => {
 

  const [memberSelectedid, SetMember] = useState(null);
  const [RoleSelected, SetRole] = useState(null);


  const handleSelectMember = (member: any) => {
    SetMember(member.id);
    SetRole(member.role);
  }
  

  return (
    <>
      {
        room
          ? (<>
              <div className="other-title">
                <p>Infos</p>
                {room && MyOptions(room , room.me, RoomSelceted)}
              </div>

              <div className="Otherimg">
                <img src={romImg}/>
              </div>

              <div className="Othername">
                <p> {room.name} </p>
              </div>

              <div className="other-options">
                <>
                {
                  room && renderOptions(RoleSelected, SetRole, room, memberSelectedid,RoomSelceted)
                }
                </>
                
                <div className="groupMembers">
                    {room.members && room.members.map( (member : any) => (
                      member.status != 'banned' && (
                        
                        <div className={`member ${member.id === memberSelectedid ? 'member-active' : ''}`}
                        onClick={()  => handleSelectMember(member) }
                        >
                          <div className="amis-image">
                            <img  src={member.avatar}/>
                          </div>
                          <div className="amis-infos">
                            <div className="amis-name"> <p>{member.login}</p> </div>
                          </div> 
                          <div className="amis-role"> <p>{member.role}</p> </div>
                        </div> 
                        )
                    ))}
                  </div>
                </div>
           
            </>
            ) 
          : ( <div className='no-info'><p>No informations</p></div>)
      }
    </>
  )
}

export default RoomInfo