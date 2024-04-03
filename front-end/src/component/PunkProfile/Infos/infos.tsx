import React, { useState, useEffect } from "react";
import axios from "axios";
import "./infos.css";
import pl from "../../../assets/logo1.svg"
import pl1 from "../../../assets/MonPlayer.svg"
import EditProfile from "../../Modals/editprofile/editprofile";

const Infos = ({user}) => {


  
  const [ShowEdit, Setedit] = useState(false);

  

  const handleCancel = () => {
    Setedit(false);
  };
  
  return (
    <div className="profile-container">
        <div className="player-infos">
          {user ? (
            <>
              <div className="ImgProfile">
                <img src={user.avatar} alt="Profile" />
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
