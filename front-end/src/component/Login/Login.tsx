import React, { useState, KeyboardEvent } from 'react';
import './Login.css';
import CanvasAnimation from '../Canvas/canvas';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { Navigate } from "react-router-dom";


interface Props {
  user: any;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

export const TwoFa = ({user ,setError} : Props) => 
{

  const [code, setcode] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  if (user)
    return <Navigate to="/Home" replace />;

  const saveData = async () => {
    const data = await axios.post(`${import.meta.env.VITE_url_back}/api/2fa/authenticate`, {twofa:code},{withCredentials: true})
    
    if(data.status == 200)
    {
      setError('');
      setIsVerified(true);
    }
  }

  if (isVerified)
    return <Navigate to="/Home" replace />;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      saveData();
    }
  };

  return (
    <div className='wfa-container'>
      <div className='wfa'>
        <h1 className='h11'> Enter your 2fa code please </h1>
        <input className='input' onKeyDown={handleKeyDown} onChange={(e) => setcode(e.target.value)}></input>
        <Button onClick={saveData}>save</Button>
      </div>
    </div>
  )
}

interface LoginProps {
  user: any;
}

export const Login = ({user}:LoginProps) => {
  if(user)
    return <Navigate to="/Home" replace />;
  return (
    <div className='cont'>
      <div className='container'>
        <p className='game-title'>Play PingPong </p>
        <a  className='login-button' href={`${import.meta.env.VITE_url_back}/api/auth/42`}>
          <p>Login with intra</p>
        </a>
      </div>
    </div>
  )
}
