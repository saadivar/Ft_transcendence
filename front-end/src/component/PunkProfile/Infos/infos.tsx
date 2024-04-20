import React, { useState, useEffect } from "react";
import axios from "axios";
import "./infos.css";
import pl from "../../../assets/logo1.svg"

import EditProfile from "../../Modals/editprofile/editprofile";
import { useNavigate } from "react-router-dom";
interface User {
  avatar : string
  login : string
  id : string
}
interface UserProps {
  user : User
}
const Infos = ({user} : UserProps) => {


  
  const [ShowEdit, Setedit] = useState(false);

  

  const handleCancel = () => {
    Setedit(false);
  };
  const navigate = useNavigate()

  const goToprofile = () => {
    user && navigate(`/profile/${user.id}`, { state: { userData: user } });
  };
  return (
    <div className="profile-container">
        <div className="player-infos">
          {user ? (
            <>
              <div className="ImgProfile">
                <img src={user.avatar} alt="Profile" onClick={goToprofile} />
              </div>
              <div className="name">
                <p>{user.login}</p>
              </div>
              <div className="edit-profile">
                <div className="edit" onClick={()=>(Setedit(true))}>
                  <p>Edit profile</p>
                </div> 
              </div>
            </>
          ) : (
            <p>Loading...</p>
            )}
        </div>

        <div className="new-game-container">
          <div className="new-game">
            <img className="myPl" src={pl}  />
            {/* <img className="myPl1" src={pl1}  /> */}
            <div>
              <p className="wlcom"> Welcome ! </p>
              <p className="ready">Are you ready for a new game ?</p>
              <div className="start-button">New game</div>
            </div>
          </div>
        </div>
        <EditProfile user={user} ShowEdit={ShowEdit} Setedit={Setedit} onCancel={handleCancel}/>
    </div>
  );

};
export default Infos;
