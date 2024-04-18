import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import Online from "./Online";
import { useSocket } from "../Socket";


interface props{
    inviter : any;
}


export default function Invite({inviter} : props){

    const [gameSocket, setGameSocket] = useState(io())
    const [start, setStart] = useState(false)
    const baseSocket = useSocket();
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

    if (inviter) {
        useEffect(()=>{
            gameSocket?.on('success', () => {
                baseSocket.emit('acceptGame', inviter.id);
            });
        },[])
        useEffect(()=>{
            gameSocket?.emit('InviteMatching', inviter.login);
        },[])
        useEffect(()=>{
            gameSocket?.on('start', (roomInfos)=>{
                setInfos(roomInfos);
                setStart(true);
            });
        },[])
    }
    
    return(
        start && <Online infos={infos} mode="online" socket={gameSocket}/>
    )
}