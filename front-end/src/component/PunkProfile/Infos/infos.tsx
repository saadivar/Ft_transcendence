import React, { useState, useEffect } from "react";
import axios from "axios";
import "./infos.css";
import pl from "../../../assets/logo1.svg"
import pl1 from "../../../assets/MonPlayer.svg"
import EditProfile from "../../Modals/editprofile/editprofile";

const Infos = () => {


  const [profileData, setProfileData] = useState(null);
  const [ShowEdit, Setedit] = useState(false);
  useEffect(() => {
    const getData = async () => {
      try {
        // Set Axios default configuration to include credentials
        const instance = axios.create({
          withCredentials: true,
          baseURL: `${import.meta.env.VITE_url_back}/api`,
        });
        instance
          .get("/auth/user")
          .then((res) => {
            const dat = res.data;

            setProfileData(dat);
          })
          .catch((err) => {
            console.log(err.response);
          });
      } catch (error) {
        console.error("Error fetching player data:", error);
      }
    };
    getData();
  }, []);
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    Setedit(false);
  };

  const handleCancel = () => {
    Setedit(false);
  };

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
        <EditProfile ShowEdit={ShowEdit} onSubmit={handleFormSubmit } onCancel={handleCancel}/>
    </div>
  );

};
export default Infos;
