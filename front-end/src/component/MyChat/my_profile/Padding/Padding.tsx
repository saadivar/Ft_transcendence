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


  console.log(pandding)
  return (
<>
  {
    pandding.length > 0 ? (
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