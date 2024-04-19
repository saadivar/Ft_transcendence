import {React, useEffect, useState} from 'react'

import image1 from '../../../assets/theFlash.jpg'
import image2 from '../../../assets/theFlash.jpg'
import "./friend.css"
import axios from 'axios'
import { Button } from 'react-bootstrap'

interface FriendProps {

  login : string;
  avatar : string

}

const Friend = ( { avatar, login }:FriendProps ) => {
  
  return (
    <div className='friend'>
      <div className='profileImg'>
        <img src={avatar} alt={login} />
      </div>
      <div className='friend-name'>{login}</div>
      <div className='friend-status'></div>
    </div>
  );
}
  
const Friends = () => {
  const [myFriends, setMyFriends] = useState<FriendProps[] | null>(null);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const resp = await axios.get('http://localhost:3000/api/friends/isaccepted', { withCredentials: true });
        setMyFriends(resp.data);
      } catch (error) {
        console.error(error);
      }
    };
    getFriends();
  }, []);



  return (
    <div className='friends-container'>
      {myFriends ? (
        <>
          <div className='search-friend'>
            <input className="searchInput" type='text' placeholder='Search for a friend...' />
            <span className="material-symbols-outlined"><div className='iconSearch'>search</div></span>
          </div>

          <div className='friends-list'>
            {myFriends ? (
              myFriends.map((friend, index) => (
                <Friend key={index} avatar={friend.avatar} login={friend.login} /> ))
            ) : ( <p> No friends </p>)}
          </div>
        </>
      ) : (<p>Loading...</p>)
      }
    </div>
  );
};

export default Friends