import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
  achievement : any;
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

// const Achievement = ({ profile } : UserinfoProps) => {


//   return (
//     <div className='achievements-container'>
//       <div className='achi-title'>Achievements</div>
//       <div className='achiv'>

//         {profile.achievement.map((achievement, index) => (
//           <div className='achievement-item' key={index}>
//               <Popup tooltip={`${achievement.name}`}>
//                 <img src={achievement.image} alt={`Achievement ${index + 1}`} />
//               </Popup>
//             </div>
//         ))}
//       </div>
//     </div>
//   );
// };

interface props {
  setUser: React.Dispatch<React.SetStateAction<null>>;
}

const UserProfile = ( {setUser} : props) => {
  const location = useLocation();
  const userData: ProfileData = (location.state as any)?.userData;


  // fetch achievment list 
  // fetch listmatches
  const [profile, SetProfile] = useState(null);

  useEffect(() =>  {

    const getProfile = async () => {
        const resp = await axios.get(`${import.meta.env.VITE_url_back}/api/auth/user/${userData.id}`, {
        withCredentials: true,
      });
    
      SetProfile(resp.data);
      console.log('profile => ',resp.data)
    }

    getProfile();

  },[])

  return (
    <div className='Userprofile'>
      { profile &&
          (
            <div className='page'>
                <UserInfos profile={profile} />
                {/* <Achievement  profile={profile}/> */}
                <ListMatch profile={profile}/>
            </div>
          )  
      }
      <MenuBar user={userData} setUser={setUser} />
    </div>
  )
}

export default UserProfile;
