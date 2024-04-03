import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login, TwoFa } from './component/Login/Login';
import './App.css';
import Punk from './component/PunkProfile/Punk';
import Chat from './component/MyChat/Chat';
import axios from 'axios';
import StartGame from './component/game/StartGame';
import { useSocket } from './component/Socket';
import UserProfile from './component/UserProfile/UserProfile';

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const socket = useSocket();
  const[fetchuser,setfetchuser] = useState(0);

  useEffect(()=>{
    socket?.on('updated', ()=> {
    
      setfetchuser((prevIsBool) => prevIsBool + 1)});
  }, [socket])



  useEffect(() => {
    const fetchData = async () => {
      try {
   

        const resp = await axios.get(`${import.meta.env.VITE_url_back}/api/auth/user`, { withCredentials: true });
        setUser(resp.data);
        
      } catch (error) {
        setError(error.response.data.message || 'An error occurred');
      }
    };
    fetchData();
  }, [fetchuser]);





  useEffect(() => {
    const handleError = () => {
      setErrorMessage("An error occurred.");
      setTimeout(() => {
        setErrorMessage('');
      }, 1000);
    };
    

    socket?.on('error', handleError);

    return () => {
      socket?.off('error');
    };
  }, [socket]);

  return (
    <Router>
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
                <Route path="/Home" element={<Punk user={user} />} />
                <Route path="/Game" element={<StartGame/>} />
                <Route path="/Chat" element={<Chat />} />
                <Route path="/profile/:userId" element={<UserProfile />} />
              </>
            )

          }
        </Routes>
      </Router>
  );
}

export default App;
