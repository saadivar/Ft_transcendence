import { useState,  useEffect } from "react";
import io from 'socket.io-client';
import './style/StartGame.css'
import FirstPage from "./FirstPage";
import axios from "axios";
import { Navigate } from "react-router-dom";

function StartGame() {
  const [socket,setsocket] = useState(io());
  const [start, setStart] = useState(false);
  const [infos, setInfos] = useState<string[]>([]);
  const [practice, setPractice] = useState(false);
  const [endGame, setendGame] = useState(false);
  const [result, setResult] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [user, setUser] = useState(null);
  const [back, setBack] = useState(false);
  
  useEffect(()=>{
    const getUser = async () =>{
      try {
        const resp =  await axios.get(`${import.meta.env.VITE_url_back}/api/auth/user`, { withCredentials: true })
        setUser(resp.data);
        const newsocket =  io(`${import.meta.env.VITE_url_socket}/game`, {
        withCredentials: true,
        transports: ['websocket']
      });
      setsocket(newsocket);
        
      }
      catch(e){
        console.log(e);
      }
    }
    getUser();
  },[])

  socket?.on('endGame',  (res : string) =>{
    setendGame(true);
    setStart(false);
    setPractice(false);
    setResult(res);
  });


  socket?.on('start', (roomInfos)=>{
      setInfos(roomInfos);
      setStart(true);
      setWaiting(false);
  })
  if (user){
    if (waiting){
      return(<div style={{backgroundImage: `url('https://www.couleurdenuit.com/img/cms/Match-de-ping-pong-23.jpg')`, backgroundSize : 'cover', backgroundPosition: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh'}}>
      <head><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet"></link></head>
        <div style={{marginLeft : '50px', paddingBottom : '100px'}}>
        <span className="spinner-grow spinner-grow-sm" style={{ marginBottom : '100px' , marginRight : '150px' , fontSize : '250%', color: '#DB8C1B'}}>Waiting...</span>
        <div className="spinner-border" style={{color : '#DB8C1B', width: '3rem', height: '3rem'}} role="status"></div>
        <div className="spinner-grow" style={{color : '#DB8C1B' , width: '3rem', height: '3rem'}} role="status"></div>
        </div>
        <button id="exit" onClick={()=>{window.location.reload()}}> Exit </button>
      </div>);
    }
    else if (back){
      return(
        <Navigate to='/home' replace/>
      )
    }
    else if (start){
      return(
          <FirstPage infos={infos} mode="online" socket={socket}/>)
    }
    else if (practice){
      return(
            <FirstPage infos={infos} mode="practice" socket={socket}/>);
    }
    else if (endGame){
        return(
          <div className="end-game">
            <div className="game-over">
              <h3> {result} </h3>
              <button onClick={()=> {window.location.reload()}}> Go back </button>
            </div>
          </div>
        )
    }
    else {
      return (
          <div className="game-container">
            {!start && !endGame && !waiting && (
            <button className="practice-button" onClick={() => setPractice(true)}> Practice </button>)}
            <button className="online-button" onClick={() => { socket.emit('CREATEROOM'); setWaiting(true);}}> Online </button>
            <img src="../../src/assets/logo1.svg" className="pong-logo"></img>
            <button className="back-button" onClick={()=>{setBack(true)}}> Go Back </button>
          </div>
        );
    }
}
};

export default StartGame;
