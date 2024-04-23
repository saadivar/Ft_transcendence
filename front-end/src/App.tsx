import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login, TwoFa } from './component/Login/Login';
import './App.css';
import Punk from './component/PunkProfile/Punk';
import Chat from './component/MyChat/Chat';
import axios from 'axios';
import { useSocket } from './component/Socket';
import UserProfile from './component/UserProfile/UserProfile';
import ChangeProfile from './component/ChangeInfos/ChangeInfos';
import OnlineMatching from './component/game/OnlineMatching';
import Invite from './component/game/Invite';
import OnAccept from './component/game/OnAccept';
import GameRequest from './component/game/GameRequest/gamereq';
import Practice from './component/game/Practice';



const NotFound = () => {
    return (
      <div className="not-found-container">
          <div className='notfound'>
            <h1 className="not-found-title">404 - Page Not Found</h1>
          </div>
      </div>
    );
};


 
function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const socket = useSocket();
  const[fetchuser,setfetchuser] = useState(0);
  const [showRequest, SetShow] = useState(false);
  const [gameRequestSender, SetSender] = useState(null);
  
  useEffect(()=>{
    socket?.on('updated', ()=> {
      setfetchuser((prevIsBool) => prevIsBool + 1)});
  }, [socket])

  useEffect(()=>{
    socket?.on('invitegame', (user)=> {
      SetSender(user);
      if (window.location.pathname != '/practice' && window.location.pathname != '/online' && window.location.pathname != '/onlineGame')
        SetShow(true)
      });
      setTimeout(() => {
        SetShow(false);
      }, 3000);
  }, [socket])
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get(`${import.meta.env.VITE_url_back}/api/auth/user`, { withCredentials: true });
        setUser(resp.data);
        
      } catch (error : any) {
        setError(error.response.data.message );
      }
    };
    fetchData();
  }, [fetchuser]);


  useEffect( () => {
      const handleError = () => {
        setErrorMessage('An error occurred: other user in acount');
      };

      socket?.on('secondwindow', handleError);

  }, [socket])

  useEffect(() => {
    const handleError = (mssg : any) => {
      
      setErrorMessage(`An error occurred: ${mssg.type}`);
      setTimeout(() => {
        setErrorMessage(''); 
      }, 1000);
    };
    
    socket?.on('error', handleError);

    return () => {
      socket?.off('error');
    };
  }, [socket]);
  
  const canceling = () => {
    SetShow(false);
  }

 

  const [isSender, setIsSender] = useState(false);
  const [recieverName, setReacieverName] = useState("");
    useEffect(()=>{
      socket?.on('acceptGame', (recieverName) => {
        setReacieverName(recieverName);
        SetgoGame(true);
        setIsSender(true);
    })
  } ,[socket])

  const [goGame, SetgoGame] = useState(false);
  return (
    <Router>
        {
          (showRequest) && gameRequestSender != null &&  <GameRequest SetShow={SetShow} 
            gameRequestSender={gameRequestSender}  
            onCancel={canceling}
            SetgoGame={SetgoGame}
            setIsSender={setIsSender}/>
        }
        {
          isSender && <OnAccept />
        }
        {
          errorMessage && (
          <div className='error-container'>
            <div className="error-popup">{errorMessage}</div>
          </div>
        )
        }
        <Routes>
          {
            error.length > 0 ?
            (
              error === '2FA' 
              ? ( <>
               <Route path="*" element={<Navigate to="/2fa" />} />  
                <Route path="/2fa" element={<TwoFa user={user} setError={setError}/>} />
              </>)
              : ( <>
                <Route path="*" element={<Navigate to="/" />} /> 
               <Route path="/" element={<Login user={user}/>} />
              </>)
            )
            :
            (
              <>
                <Route path="/2fa" element={<TwoFa user={user} setError={setError}/>} />
                <Route path="/" element={<Login user={user} />} />
                <Route path="/Home" element={<Punk SetgoGame={SetgoGame} user={user} setUser={setUser} setErrorMessage={setErrorMessage}/>} />

                <Route path="/practice" element={<Practice mode='practice' goGame={goGame}/>} />
                <Route path="/online" element={<OnlineMatching goGame={goGame}/>} />
                <Route path="/onlineGame" element={<Invite  inviter={gameRequestSender} isSender={isSender} recieverName={recieverName} goGame={goGame} setIsSender={setIsSender} />} /> 

                <Route path="/Chat" element={<Chat user={user} setUser={setUser}/>} />
                {user && <Route path="/Changeinfo" element={<ChangeProfile user={user} />} />}
                <Route path="/profile/:userId" element={<UserProfile setUser={setUser}/>} />
                {user && <Route path="*" element={<NotFound />} />}
              </>

            )
          }
        </Routes>
      </Router>
  );
}

export default App;
