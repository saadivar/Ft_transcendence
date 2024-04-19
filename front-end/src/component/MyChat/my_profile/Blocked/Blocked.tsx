import React from 'react'
import "./Blocked.css"
import axios from 'axios'

const Blocked = ({blocked, setboolblock,  userSelect}) => {

 
  userSelect(null);
 const handleUnblock = async (friendId : number) => {
  try {
      const res = await axios.post(`${import.meta.env.VITE_url_back}/api/friends/unblock`, {id: friendId}, { withCredentials: true })
      setboolblock((prevIsBool) => prevIsBool + 1);
  }  
  catch (error) {
      console.log(error);
  }
 }

  return (
    <>
    {
      blocked ? blocked.map((friend) => (

        <div className="discussion-blocked" key={friend.id}>
                    
            <div className="amis-image">
                <img src={friend.avatar}/>
            </div>
    
            <div className="amis-infos">
                <p className="amis-name"><p>{friend.login}</p></p>
            </div>
    
            <div className="amis-status unblock" onClick={() => handleUnblock(friend.id)}>Unblock</div>
    
        </div>
      )) : (<p className='no-pen'> No Blocked friend </p>)
    }
    </>
  )
}

export default Blocked