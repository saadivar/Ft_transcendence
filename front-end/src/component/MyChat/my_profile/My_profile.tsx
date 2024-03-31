import { React, useEffect, useState } from "react";
import "./My_profile.css";
import Friends_discusion from "./Friends-discusion/friends";
import Blocked from "./Blocked/Blocked";
import Padding from "./Padding/Padding";
import Rooms from "./rooms/Rooms";
import axios from "axios";
import MyData from "./myProfileInfos/MyData";
import { useSocket } from "../../Socket";


const My_profile = ({ RoomSelceted, selectedroom,selectedUser, UserSelceted, Profile , optionSelected, SetOption, SetMessages,SetMessagesRoom}) => {
  const [boolblock,setboolblock] = useState(0);
  const [boolpending,setboolpending] = useState(0);
  const [fetchRoomNotif,SetFetchRoomNotif] = useState(0);
  
  const socket = useSocket();
  const [Notifs, SetNotifs] = useState([]);
  const [RoomNotifs, SetRoomNotifs] = useState([]);
  const [countByType, setCountByType] = useState({});


  const HandleSetOption = (option: any) => {
    
    UserSelceted(null);
    RoomSelceted(null);
    if(selectedroom)
      socket?.emit('chatroomdeselected', selectedroom.name);
    if (option == "padding") {
      SetNotifs((prevNotifs) => prevNotifs.filter(notif => notif.type === "message"));
      socket.emit('notif', {type:"pending",senderid:0});
      setCountByType({});
    }
    SetOption(option);
  };

  useEffect(() => {
    const fetchNotifs = async () =>{

      const resp = await axios.get(`${import.meta.env.VITE_url_back}/api/chat/notifications`, {withCredentials:true})
      console.log("here 00")

      SetNotifs(resp.data);

    }
    fetchNotifs();
  }, []);

  useEffect(() => {
    const fetchNotifs = async () =>{
      const resp = await axios.get(`${import.meta.env.VITE_url_back}/api/room/roomnotifications`, {withCredentials:true})
      SetRoomNotifs(resp.data);
    }
    fetchNotifs();
  }, [fetchRoomNotif]);

  useEffect(() => {
    let newCountByType = {};
  
    Notifs.forEach(notif => {
      const {type} = notif;

      if(optionSelected !== "padding")
        newCountByType[type] = (newCountByType[type] || 0) + 1;
      //need to add all message
    });
    setCountByType(newCountByType);

  }, [Notifs]);


  useEffect(() => {

      socket?.on('notif', (payload) => {
        SetNotifs(prevNotifs => [...prevNotifs , {type: payload.type , senderid: payload.senderid}])
        Notifs.length > 0 && console.log ("hey bro = " , Notifs);
      });
    return () => {
      socket?.off('notif');
    };
  }, [socket]);
 

  useEffect(() => {

    socket?.on('notifroommessage', () => SetFetchRoomNotif((prevIsBool) => prevIsBool +1 ));

    
    return () => {
      socket?.off('notifroommessage');
    };
  }, [socket]);

  useEffect(() => {
    
  socket?.on('block', ()=> setboolblock((prevIsBool) => prevIsBool + 1));

  return () => {
    socket?.off('block');

  };
  }, [socket]);

  useEffect(() => {
    socket?.on('friendRequestReceived', ()=> setboolpending((prevIsBool) => prevIsBool + 1));
    return () => {
      socket?.off('friendRequestReceived');
    };
  }, [socket]);

    ////// Friends fetching data //////

  const [FrinedsData, SetFriendsData] = useState(null);

  useEffect(() => {
    const getFriendsData = async () => {
      try {
        const resp = await axios.get(
          `${import.meta.env.VITE_url_back}/api/friends/isaccepted`,
          { withCredentials: true }
        );
        SetFriendsData(resp.data);
      } catch (error) {
        console.log(error);
      }
    };
    getFriendsData();
  }, [boolblock,boolpending]);

    /////////////////////
    ////// Rooms fetching data //////
    const [brodcast, Setbrodcast] = useState(0);

    useEffect(() => {
      socket?.on('brodcast', ()=> Setbrodcast((prevIsBool) => prevIsBool + 1))
  
    return () => {
      socket?.off('brodcast');

    };
  }, [socket]);

  //
  useEffect(() => {
    
    socket?.on('newmember', ()=> {
      console.log("it seted -> ") 
      Setbrodcast((prevIsBool) => prevIsBool + 1)
    })
 
  return () => {
   
    socket?.off('newmember');
  };
}, [socket]);

  const [RoomData, SetRoomData] = useState(null);

  useEffect(() => {
    const getRoomData = async () => {
      try {
        const resp = await axios.get(
          `${import.meta.env.VITE_url_back}/api/room/listjoinedrooms`,
          { withCredentials: true }
        );
        SetRoomData(resp.data);
      } catch (error) {
        console.log(error);
      }
    };
    getRoomData();
  }, [brodcast]);
  
  RoomData && console.log("rooms = " ,RoomData);
  const [NotRoomsdata ,SetNotRoomsdata] = useState(null);

  useEffect(() => {
    const getRoomData = async () => {
      try {
        const resp = await axios.get(
          `${import.meta.env.VITE_url_back}/api/room/listnotjoinedrooms`,
          { withCredentials: true }
        );
        SetNotRoomsdata(resp.data);
      } catch (error) {
        console.log(error);
      }
    };
    getRoomData();
  }, [brodcast]);
    /////////////////////
    ////// Blocked fetching data //////
    
  const [BlockedData, SetBlockedData] = useState(null);

  useEffect(() => {
    const getBlokcedData = async () => {
      try {
          const resp = await axios.get(`${import.meta.env.VITE_url_back}/api/friends/blockedlist`, {withCredentials: true})
          SetBlockedData(resp.data);
      }
      catch(error) {
        console.log(error);
      }
    }
    getBlokcedData();
  }, [boolblock])
  
  /////////////////////
  const [profileData, setProfileData] = useState(null);

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

  (profileData && Profile(profileData)); //fill user data
  const [pandding, SetPanding] = useState(null);

  useEffect( () => {
    const getData = async () =>{
      try {
        const resp = await axios.get(`${import.meta.env.VITE_url_back}api/friends/notaccepted`, {withCredentials:true}); 
        SetPanding(resp.data)
      }   
      catch(error){
        console.log(error);
      } 
    } 
    getData();
  }, [boolpending])




  return (
    <div className="Myprofile">
      <MyData profileData={profileData}
      />

      <div className="selections">
        <div className={`select section-friends ${ optionSelected === "friends" ? "selected" : ""}`}
          onClick={() => HandleSetOption("friends")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="ai ai-PeopleMultiple"
          >
            <circle cx="7" cy="6" r="3" />
            <path d="M10 13H5.818a3 3 0 0 0-2.964 2.537L2.36 18.69A2 2 0 0 0 4.337 21H9" />
            <path d="M21.64 18.691l-.494-3.154A3 3 0 0 0 18.182 13h-2.364a3 3 0 0 0-2.964 2.537l-.493 3.154A2 2 0 0 0 14.337 21h5.326a2 2 0 0 0 1.976-2.309z" />
            <circle cx="17" cy="6" r="3" />
          </svg>

         
        </div>

        <div
          className={`select section-rooms ${
            optionSelected === "rooms" ? "selected" : ""
          }`}
          onClick={() => HandleSetOption("rooms")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="ai ai-PeopleGroup"
          >
            <path d="M16.719 19.752l-.64-5.124A3 3 0 0 0 13.101 12h-2.204a3 3 0 0 0-2.976 2.628l-.641 5.124A2 2 0 0 0 9.266 22h5.468a2 2 0 0 0 1.985-2.248z" />
            <circle cx="12" cy="5" r="3" />
            <circle cx="4" cy="9" r="2" />
            <circle cx="20" cy="9" r="2" />
            <path d="M4 14h-.306a2 2 0 0 0-1.973 1.671l-.333 2A2 2 0 0 0 3.361 20H7" />
            <path d="M20 14h.306a2 2 0 0 1 1.973 1.671l.333 2A2 2 0 0 1 20.639 20H17" />
          </svg>

        </div>

        <div
          className={`select section-blocked ${
            optionSelected === "blocked" ? "selected" : ""
          }`}
          onClick={() => HandleSetOption("blocked")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="ai ai-PersonCross"
          >
            <circle cx="12" cy="7" r="5" />
            <path d="M17 22H5.266a2 2 0 0 1-1.985-2.248l.39-3.124A3 3 0 0 1 6.649 14H7" />
            <path d="M21 18l-3-3m3 0l-3 3" />
          </svg>
        </div>

        <div
          className={`select section-padding ${
            optionSelected === "padding" ? "selected" : ""
          }`}
          onClick={() => HandleSetOption("padding")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="ai ai-Clock"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M15 16l-2.414-2.414A2 2 0 0 1 12 12.172V6" />
          </svg>

          {optionSelected !== "padding" && countByType["pending"] > 0 && ( <span className="Notification">{countByType["pending"]}</span>)}
        </div>
      </div>

      <div className="discussions discussionrooms">
        {FrinedsData && optionSelected === "friends" ? (
          <Friends_discusion
            friendsData={FrinedsData}
            userSelect={UserSelceted}
            selectedUser={selectedUser}
            SetNotifs={SetNotifs}
            Notifs={Notifs}
            SetMessages={SetMessages}
          />
        ) : (RoomData || NotRoomsdata) && optionSelected === "rooms" ? (
          <Rooms
            Roomsdata={RoomData}
            selectedroom={selectedroom}
            SetRoomData={SetRoomData}
            RoomSelect={RoomSelceted}
            NotRoomsdata={NotRoomsdata}
            SetNotRoomsdata={SetNotRoomsdata}
            RoomNotifs={RoomNotifs} 
            SetRoomNotifs={SetRoomNotifs}
            SetMessagesRoom={SetMessagesRoom}
          />
        ) : optionSelected === "blocked" ? (
          <Blocked 
            Blocked={BlockedData}
            setboolblock={setboolblock}
            userSelect={UserSelceted}
            />
        ) : optionSelected === "padding" && pandding? (
          <Padding 
            pandding={pandding}
            userSelect={UserSelceted}
            />
        ) : null}
      </div>
    </div>
  );
};

export default My_profile;
