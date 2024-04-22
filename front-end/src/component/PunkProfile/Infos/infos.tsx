import React, { useState, useEffect } from "react";
import axios from "axios";
import "./infos.css";
import pl from "../../../assets/logo1.svg"

import EditProfile from "../../Modals/editprofile/editprofile";
import { Link, useNavigate } from "react-router-dom";
import Popup from "../../Modals/popup/Popup";
interface User {
  avatar : string
  login : string
  id : string
}
interface UserProps {
  user : User
  SetgoGame:any
  setErrorMessage:any;
}
const Infos = ({user, SetgoGame, setErrorMessage} : UserProps) => {


  
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
                <Popup tooltip="visite profile">
              <div className="ImgProfile">
                  <img src={user.avatar} alt="Profile" onClick={goToprofile} />
              </div>
                </Popup>
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
      
            <div>
              <p className="wlcom"> Welcome ! </p>
              <p className="ready">Are you ready for a new game ?</p>
              <Link to="/online">
                <div className="start-button" onClick={()=>SetgoGame(true)}>New game</div>
              </Link>
            
            </div>

          </div>
        </div>
        <EditProfile user={user} ShowEdit={ShowEdit} Setedit={Setedit} onCancel={handleCancel} setErrorMessage={setErrorMessage}/>
    </div>
  );

};
export default Infos;
