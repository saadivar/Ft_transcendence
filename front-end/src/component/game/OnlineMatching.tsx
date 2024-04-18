import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Online from "./Online";
import './style/StartGame.css'
import { Navigate, useNavigate } from "react-router-dom";


function OnlineMatching({goGame}){


    if(!goGame){
		return <Navigate to="/Home" replace />;
	}
    const [socket,setSocket] = useState(io());
    const [waiting,setWaiting] = useState(true);
    const [start,setStart] = useState(false);



    const [infos,setInfos] = useState<string[]>([]);

    useEffect(()=>{
        const getSocket = async () =>{
            try {
                const newsocket =  io(`${import.meta.env.VITE_url_socket}/game`, {
                    withCredentials: true,
                    transports: ['websocket']
                });
                setSocket(newsocket);
            }
            catch(e){
                console.log(e);
            }
        }
        getSocket();
    },[])
    window.addEventListener('popstate', function(event) {
        socket.close();
        setStart(false);
        console.log("END GAME")

    });
    socket?.on('start', (roomInfos)=>{
        setInfos(roomInfos);
        setStart(true);
        setWaiting(false);
    });

    if (waiting){
        socket.emit('CREATEROOM');
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
   
        return(
            <>
            {
                start &&
                    <Online infos={infos} mode='online' socket={socket}/>
            }
            </>
          )
    // }

}

export default OnlineMatching;