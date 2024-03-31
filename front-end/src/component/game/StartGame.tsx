import { useState,  useEffect } from "react";
import io, { Socket } from 'socket.io-client';
import { GamesList } from "./GamesList";
import './StartGame.css'
import FirstPage from "./FirstPage";
import axios from "axios";


interface gameScore{
  player1Name : string;
  player2Name : string;
  player1Score : number;
  player2Score : number;
}



function StartGame() {
  
  
  const [socket,setsocket] = useState()
  let [gameslist, setGamesList] = useState<string[]>([]);
  const [start, setStart] = useState(false);
  const [infos, setInfos] = useState();

  const [practice, setPractice] = useState(false);

  const [endGame, setendGame] = useState(false);

  const [waiting, setWaiting] = useState(false);

  // gameslist = ["0xMonster", "0xZero"];
  const [user, setUser] = useState(null);
  
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
  
  socket?.on('endGame',  (score : gameScore) =>{
    setendGame(true);
    setStart(false);
    setPractice(false);
    console.log("END Game PAGE ",  score);
  });
  socket?.on('GamesList', (gamesList : string[]) => {
    setGamesList(gamesList);
  });
  // socket?.on('connect', ()=>{
  //   socket.emit('connectEvent');
  // });
  // socket?.on('disconnect', ()=>{
  //   socket.emit('connectEvent');

  // })

  socket?.on('start', (roomInfos)=>{
    console.log("roomNAME : ", roomInfos);
      setInfos(roomInfos);
      setStart(true);
      setWaiting(false);
  })
  if (user){
    console.log("USER : ", user);
  if (waiting){
    return(<div style={{backgroundImage: `url('https://www.couleurdenuit.com/img/cms/Match-de-ping-pong-23.jpg')`, backgroundSize : 'cover', backgroundPosition: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh'}}>
     <head><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet"></link></head>
      <div style={{marginLeft : '50px', paddingBottom : '100px'}}>
      <span className="spinner-grow spinner-grow-sm" style={{ marginBottom : '100px' , marginRight : '150px' , fontSize : '250%', color: '#DB8C1B'}}>Waiting...</span>
      <div className="spinner-border" style={{color : '#DB8C1B', width: '3rem', height: '3rem'}} role="status"></div>
      <div className="spinner-grow" style={{color : '#DB8C1B' , width: '3rem', height: '3rem'}} role="status"></div>
      </div>
    </div>);
  }
  else if (start){
    return(
        <FirstPage infos={infos} mode="online" socket={socket}/>
    )
  }
  else if (practice){
    return(
      <FirstPage infos={infos} mode="practice" socket={socket}/>)
  }
  else if (endGame){
      return(
        <div className="end-game">
          <div className="game-over">
            <button> Go back </button>
          </div>
        </div>
      )
  }
  else {
    return (
        <div className="game-container">
          {!start && !endGame && !waiting && (
            <button className="practice-button" onClick={() => setPractice(true)}></button>
          )}
          <button className="create-button" onClick={() => { socket.emit('CREATEROOM'); setWaiting(true);  }}></button>
          {gameslist.length > 0 && <GamesList list={gameslist} user={user} socket={socket}/>}
        </div>
      );
    
  }
}
  // return (
  //   <div className={start ? "game" : ""}>


  //   </div>
  // )

};


export default StartGame;


//saad-ADAM2014