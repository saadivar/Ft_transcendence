import React, { useEffect, useState } from 'react'
import "./Padding.css"
import axios from 'axios';
interface Friend{
  id : string ;
  avatar: string;
  login: string
}

interface PaddingProps {
  pandding: Friend[] | null;
  userSelect: (friend: Friend | null) => void;
}

const Padding = ({pandding,  userSelect} :PaddingProps) => {

  useEffect(()=>{

    userSelect(null);
  },[])

  const handleAccept = async (friend: Friend) => {
    try {
       
        await axios.post(`${import.meta.env.VITE_url_back}/api/friends/acceptrequest`, {id: friend.id}, { withCredentials: true });
    } catch (error) {
        console.error( error);
    }
};

const handleReject = async (friend: Friend) => {
  try {
      await axios.post(`${import.meta.env.VITE_url_back}/api/friends/rejectrequest`, {id: friend.id}, { withCredentials: true });
  } catch (error) {
      console.error( error);
  }
};


  return (
    <>
      {
        pandding && pandding.length > 0 ? (
          pandding.map((friend) => (
            <div className="discussion-pandding" key={friend.id}>
              <div className="amis-image">
                <img src={friend.avatar} alt="Friend Avatar" />
              </div>

              <div className="amis-infos">
                <p className="amis-name">{friend.login}</p>
              </div>

              <div className="amis-stat"> 
                <div className="reject" onClick={() => handleReject(friend)}>reject</div>
                <div className='accept' onClick={() => handleAccept(friend)}>accept</div>
              </div>
            </div>
          ))
        ) : (
          <p className='no-pen'>No friend request</p>
        )
      }  
    </>
  )
}


export default Padding