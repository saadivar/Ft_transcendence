import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import Online from "./Online";
import { useSocket } from "../Socket";
import { Navigate, useNavigate } from "react-router-dom";


interface props{
    inviter : any;
    isSender : boolean;
    recieverName : string;
    goGame: boolean;
    setIsSender : Function;
}


export default function Invite({inviter, isSender, recieverName, goGame, setIsSender} : props){


    if(!goGame){
		return <Navigate to="/Home" replace />;
	}
    const [gameSocket, setGameSocket] = useState(io())
    const [start, setStart] = useState(false)
    const baseSocket = useSocket();
    const [infos, setInfos] = useState<string[]>([]);
    const navigate = useNavigate();
    useEffect(()=>{
        const getSocket = async () =>{
            try {
                const newsocket =  io(`${import.meta.env.VITE_url_socket}/game`, {
                    withCredentials: true,
                    transports: ['websocket']
                });
                setGameSocket(newsocket);
            }
            catch(e){
            }
        }
        getSocket();
    },[])

    if (isSender){
        gameSocket?.emit('InviterJoining', recieverName);
    }
    else {
        gameSocket?.emit('InviteMatching', inviter?.login);
    }
    gameSocket?.on('success', () => {
        baseSocket.emit('acceptGame', inviter?.id);
    });

    gameSocket?.on('start', (roomInfos)=>{
        setInfos(roomInfos);
        setStart(true);
    });
    window.addEventListener('popstate', function(event) {
        gameSocket.emit('exit');
    });
    gameSocket.on('exit', ()=>{
        gameSocket.close();
        setStart(false);
        setIsSender(false);
        navigate("/Home", { replace: true });
    })
    
    return(
        start && <Online infos={infos} mode="online" socket={gameSocket}/>
    )
}