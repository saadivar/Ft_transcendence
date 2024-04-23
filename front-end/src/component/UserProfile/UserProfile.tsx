import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import MenuBar from '../PunkProfile/MenuBar/MenuBar';
import Infos from '../PunkProfile/Infos/infos';
import ListMatch from './MatchHistory/Match';

import "./UserProfile.css";
import win1 from '../../assets/1win.png'
import win2 from  '../../assets/2win.png'
import win3 from  '../../assets/3wins.png'
import win4 from  '../../assets/4wins.png'
import win5 from  '../../assets/5wins.png'
import Popup from '../Modals/popup/Popup';
import axios from 'axios';


interface ProfileData {
  avatar: string;
  login: string;
  isTwoFactorAuthenticationEnabled : boolean;
  id : number;
  acheivment : any;
  games : any;
  wins : any;
  loses : any;
  totalplayed : any;

}
interface UserinfoProps {
  profile : ProfileData;
}

const NotFound = () => {
  return (
    <div className="not-found-container">
        <div className='notfound'>
          <h1 className="not-found-title">404 - Page Not Found</h1>
        </div>
    </div>
  );
};

const UserInfos = ({ profile } : UserinfoProps) => {
  return (
    <div className="profile-container">
      <div className="player-infos">
        {profile ? (
          <>
            <div className="ImgProfile">
              <img src={profile.avatar} alt="Profile" />
            </div>
            <div className="name">
              <p>{profile.login}</p>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      <div className="new-game-container">

        <div className='stat-title'>Statistics</div>

        <div className="stats-container ">
          <div className='macthes'>
            <div className='matches-tit'>Matches</div>
            <div className='ttmatches'>{profile.totalplayed}</div>
          </div>
          <div className='wins'>
            <div className='wins-tit'>Wins</div>
            <div className='ttwins'>{profile.wins}</div>

          </div>
          <div className='loses'>
            <div className='loses-tit'>Loses</div>
            <div className='ttloses'>{profile.loses}</div>
          </div>
        </div>
      </div>

    </div>
  );
}

const Achievement = ({ profile } : UserinfoProps) => {

  const achievementsList = [
    { name: '1win', image: win1 },
    { name: '2wins', image: win2 },
    { name: '3wins', image: win3 },
    { name: '4wins', image: win4 },
    { name: '5wins', image: win5 },
  ];

  return (
    <div className='achievements-container'>
      <div className='achi-title'>Achievements</div>
      <div className='achiv'>
      {profile.acheivment.map((achievement: any, index:any) => {
        const achievementData = achievementsList.find(a => a.name === achievement.name);
        return(
          <div className='achievement-item' key={index}>
            <Popup tooltip={`${achievement.name}`}>
              <img src={achievementData ? achievementData.image : undefined} alt={`Achievement ${achievement.name}`} />
            </Popup>
          </div>
        )

      })}
      </div>
    </div>
  );
};
interface props {
  setUser : any;
}


const UserProfile = ( {setUser} : props) => {
  // const location = useLocation();
  // const userData: ProfileData = (location.state as any)?.userData;
  const { userId } = useParams();
  const [profile, SetProfile] = useState(null);
  const [not, setnot] = useState('')
  const [usr, setusr] = useState(null)
  
  useEffect(() =>  {

    const getProfile = async () => {
        
      try {
        const resp = await axios.get(`${import.meta.env.VITE_url_back}/api/auth/user/${userId}`, {
          withCredentials: true,
        });
        SetProfile(resp.data);

        
      } catch (error : any) {
        setnot('404')
      }
    }

    getProfile();

  },[userId])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get(`${import.meta.env.VITE_url_back}/api/auth/user`, { withCredentials: true });
        setusr(resp.data);
        
      } catch (error : any) {
      }
    };
    fetchData();
  }, [userId]);

  if(not == '404'){
    return (
      <NotFound />
     )
  }

  return (
    <div className='Userprofile'>
      { profile &&
          (
            <div className='page'>
                <UserInfos profile={profile} />
                <Achievement  profile={profile}/>
                <ListMatch profile={profile}/>
            </div>
          )  
      }
      {usr && <MenuBar user={usr} setUser={setUser} />}
    </div>
  )
}

export default UserProfile;
