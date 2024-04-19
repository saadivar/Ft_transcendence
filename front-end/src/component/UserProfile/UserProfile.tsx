import React from 'react';
import { useLocation } from 'react-router-dom';
import MenuBar from '../PunkProfile/MenuBar/MenuBar';
import Infos from '../PunkProfile/Infos/infos';
import ListMatch from '../PunkProfile/MatchHistory/Match';

import "./UserProfile.css";
import win1 from '../../assets/1win.png'
import win2 from  '../../assets/2win.png'
import win3 from  '../../assets/3wins.png'
import win4 from  '../../assets/4wins.png'
import win5 from  '../../assets/5wins.png'
import Popup from '../Modals/popup/Popup';


interface ProfileData {
  avatar: string;
  login: string;
  isTwoFactorAuthenticationEnabled : boolean
}
interface UserinfoProps {
  profileData : ProfileData;
}

const UserInfos = ({ profileData } : UserinfoProps) => {
  return (
    <div className="profile-container">
      <div className="player-infos">
        {profileData ? (
          <>
            <div className="ImgProfile">
              <img src={profileData.avatar} alt="Profile" />
            </div>
            <div className="name">
              <p>{profileData.login}</p>
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
            {/* number of matches */}
          </div>
          <div className='wins'>
            <div className='wins-tit'>Wins</div>
            {/* porcentage of winss */}

          </div>
          <div className='loses'>
            <div className='loses-tit'>Loses</div>
            {/* porcentage of loses */}
          </div>
        </div>
      </div>

    </div>
  );
}

const Achievement: React.FC = () => {
  const achievementsList = [
    { name: 'one', image: win1 },
    { name: 'two', image: win2 },
    { name: 'three', image: win3 },
    { name: 'four', image: win4 },
    { name: 'five', image: win5 },
  ];

  return (
    <div className='achievements-container'>
      <div className='achi-title'>Achievements</div>
      <div className='achiv'>

        {achievementsList.map((achievement, index) => (
          <div className='achievement-item' key={index}>
              <Popup tooltip={`${achievement.name}`}>
                <img src={achievement.image} alt={`Achievement ${index + 1}`} />
              </Popup>
            </div>
        ))}
      </div>
    </div>
  );
};
interface props {
  setUser: React.Dispatch<React.SetStateAction<null>>;
}

const UserProfile = ( {setUser} : props) => {
  const location = useLocation();
  const userData: ProfileData = (location.state as any)?.userData;


  // fetch achievment list 
  // fetch listmatches

  return (
    <div className='Userprofile'>
      <div className='page'>
        <UserInfos profileData={userData} />
        <Achievement />
        <ListMatch />
      </div>
      <MenuBar user={userData} setUser={setUser} />
    </div>
  )
}

export default UserProfile;
