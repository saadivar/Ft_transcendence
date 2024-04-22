import {React, useEffect, useState} from 'react'

import image1 from '../../../assets/theFlash.jpg'
import image2 from '../../../assets/theFlash.jpg'
import "./friend.css"
import axios from 'axios'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Popup from '../../Modals/popup/Popup'

interface FriendProps {

  login : string;
  avatar : string;
  user : any;

}

const Friend = ( { avatar, login , user}:FriendProps ) => {
  const navigate = useNavigate()

  const goToprofile = () => {
    user && navigate(`/profile/${user.id}`, { state: { userData: user } });
  };

  return (
    <div className='friend' >
    


      <div className='profileImg'>
        <img src={avatar} alt={login} />
      </div>
      <div className='friend-name'>{login}</div>
      <div className='friend-status' onClick={goToprofile}>Visite profile</div>
    </div>
  );
}
  
const Friends = () => {
  const [myFriends, setMyFriends] = useState<FriendProps[] | null>(null);

  useEffect(() => {
    const getFriends = async () => {
      try {
        
        const resp = await axios.get(`${import.meta.env.VITE_url_back}/api/friends/isaccepted`, { withCredentials: true });
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
          <div className='friend-title'>Friends</div>

          <div className='friends-list'>
            {myFriends ? (
              myFriends.map((friend, index) => (
                <Friend key={index} avatar={friend.avatar} login={friend.login} user={friend}/> ))
            ) : ( <p> No friends </p>)}
          </div>
        </>
      ) : (<p>Loading...</p>)
      }
    </div>
  );
};

export default Friends