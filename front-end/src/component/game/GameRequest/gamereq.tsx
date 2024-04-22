
import {motion, AnimatePresence} from 'framer-motion'

import "./gamereq.css"
import { useNavigate } from 'react-router-dom'
import { Socket, io } from 'socket.io-client'
import { useEffect, useState } from 'react'

function GameRequest({SetShow ,gameRequestSender, onCancel, SetgoGame, setIsSender}) {

    const [gameSocket, setGameSocket] = useState(io())

    const backdrop = {
        visible : {opacity: 1},
        hidden: {opacity: 0}
    }

    const modal = {
        hidden :{
            y :"-100vh",
            opacity: 0 },
        visible: {
            y : "200px",
            opacity: 1,
            transition : {delay: 0.5}
        }
    }
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

    const navigate = useNavigate(); 

    const handleSubmit =()=>{
        gameSocket?.emit('isInGame', gameRequestSender.login);
    }

    gameSocket.on('NotInGame', ()=>{
        SetgoGame(true);
        SetShow(false);
        setIsSender(false);
        navigate("/onlineGame", { replace: true });
    })
    gameSocket.on('PlayerInGame', ()=>{ // Player In Game ERROORRRR
        SetShow(false);
    })
    return (
        <AnimatePresence>

        <motion.div className="modal-backdrop"
            variants={backdrop}
            initial="hidden"
            animate="visible"
        >
            <motion.div className="modal-content-inv"
            variants={modal}>
                <p className='INVIT'>GAME INVITATION</p>
                <img src={gameRequestSender.avatar} className='INV-IMG'></img>
                <p className='INV-NAME'>{gameRequestSender.login}</p>
                <p className='INV-text'>invited you to play a game</p>
                <div className="butt-add-modal">
                    <div className="But-modal submit-But-modal"onClick={handleSubmit}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="36"
                            height="36"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ai ai-Check"
                        >
                            <path d="M4 12l6 6L20 6" />
                        </svg>
                    </div>
                    <div className="But-modal Cancel-But-modal"
                    onClick={onCancel}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="36"
                            height="36"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ai ai-Cross"
                        >
                            <path d="M20 20L4 4m16 0L4 20" />
                        </svg>
                    </div>
                </div>
            </motion.div>
        </motion.div>
      </AnimatePresence>

    );
  }
  export default GameRequest