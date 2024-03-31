import React, { useEffect, useState } from 'react'
import "./Padding.css"
import axios from 'axios';


const Padding = ({pandding,  userSelect}) => {

  userSelect(null);

  const handleAccept = async (friend) => {
    try {
       
        const response = await axios.post(`${import.meta.env.VITE_url_back}/api/friends/acceptrequest`, {id: friend.id}, { withCredentials: true });
    } catch (error) {
        console.error( error);
    }
};

const handleReject = async (friend) => {
  try {
      const response = await axios.post(`${import.meta.env.VITE_url_back}/api/friends/rejectrequest`, {id: friend.id}, { withCredentials: true });
  } catch (error) {
      console.error( error);
  }
};



  return (
     <>
      {
        // handle size of 
       pandding ? pandding.map((friend) => (
        
        <div className="discussion-pandding">
          <div className="amis-image">
              <img src={friend.avatar}/>
          </div>

          <div className="amis-infos">
              <p className="amis-name"><p>{friend.login}</p></p>
          </div>

          <div className="amis-stat"> 
              <div className="reject" onClick={() => handleReject(friend)} >reject</div>
              <div className='accept' onClick={() => handleAccept(friend)}>accept</div>
          </div>
          </div>
        )) : (
            <p className='no-pen'> No friend request </p>
        )
 
      }  
     </>

  )
}

export default Padding