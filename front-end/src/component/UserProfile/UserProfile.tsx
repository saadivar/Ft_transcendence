import React from 'react';
import { useLocation } from 'react-router-dom';
import MenuBar from '../PunkProfile/MenuBar/MenuBar';
import Infos from '../PunkProfile/Infos/infos';
import ListMatch from '../PunkProfile/MatchHistory/Match';

import "./UserProfile.css";

interface ProfileData {
  avatar: string;
  login: string;
}

const UserInfos: React.FC<{ profileData: ProfileData | null }> = ({ profileData }) => {
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
  return (
    <div className='achievements-container'>
      <div className='achi-title'>Achievements</div>
      <div className='achiv'>

      </div>
    </div>
  )
}

const UserProfile: React.FC = () => {
  const location = useLocation();
  const userData: ProfileData = (location.state as any)?.userData;

  return (
    <div className='Userprofile'>
      <div className='page'>
        <UserInfos profileData={userData} />
        <Achievement />
        <ListMatch />
      </div>
      <MenuBar user={userData} />
    </div>
  )
}

export default UserProfile;
