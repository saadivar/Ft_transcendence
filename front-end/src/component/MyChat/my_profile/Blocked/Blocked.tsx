import React, { useEffect } from 'react'
import "./Blocked.css"
import axios from 'axios'
interface Friend {
  id: number;
  login: string;
  avatar: string;
}

interface BlockedProps {
  blocked: Friend[] | null;
  setboolblock: React.Dispatch<React.SetStateAction<number>>;
  userSelect: (user: any) => void;
}
const Blocked = ({blocked, setboolblock,  userSelect} : BlockedProps) => {

 useEffect(()=>{

   userSelect(null);
 },[])
 const handleUnblock = async (friendId : number) => {
  try {
       await axios.post(`${import.meta.env.VITE_url_back}/api/friends/unblock`, {id: friendId}, { withCredentials: true })
      setboolblock((prevIsBool) => prevIsBool + 1);
  }  
  catch (error) {
  }
 }

  return (
    <>
    {
      blocked && blocked.length > 0 ? (blocked.map((friend) => (

        <div className="discussion-blocked" key={friend.id}>
                    
            <div className="amis-image">
                <img src={friend.avatar}/>
            </div>
    
            <div className="amis-infos">
                <div className="amis-name"><p>{friend.login}</p></div>
            </div>
    
            <div className="amis-status unblock" onClick={() => handleUnblock(friend.id)}>Unblock</div>
    
        </div>
      ))) : (<p className='no-pen'> No Blocked friend </p>)
    }
    </>
  )
}

export default Blocked