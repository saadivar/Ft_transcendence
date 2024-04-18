import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import Online from "./Online";


interface props{
    baseSocket : Socket;
    inviter : any;
    receiver : any;
}


export default function Invite({baseSocket ,inviter} : props){

    const [gameSocket, setGameSocket] = useState(io())
    const [start, setStart] = useState(false)

    const [infos, setInfos] = useState<string[]>([]);
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
                console.log(e);
            }
        }
        getSocket();
    },[])

        gameSocket?.emit('InviteMatching', inviter.login);
        
        gameSocket?.on('start', (roomInfos)=>{
            setInfos(roomInfos);
            setStart(true);
        });
    
    gameSocket?.on('success', () => {
        baseSocket.emit('accept');
    });

    return(
        start && <Online infos={infos} mode="online" socket={gameSocket}/>
    )
}