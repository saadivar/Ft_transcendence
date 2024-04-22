import React, { useEffect, useState } from 'react'
import {motion, AnimatePresence} from 'framer-motion'

import "./LogsModal.css"
import axios from 'axios';

interface LogsModalProps {
    room: {
      members: {
        id: string;
        avatar: string;
        login: string;
        status: string;
      }[];
      name: string;
    };
    onCancel: () => void;
  }

 

    const  LogsModal = ({ room, onCancel} : LogsModalProps) => {


        const [banned, setBanned] = useState<{
            id: string;
            avatar: string;
            login: string;
            status: string;
        }[]>([]);

        useEffect(() => {
            if (room.members) {
                const bannedMembers = room.members.filter(member => member.status === 'banned');
                setBanned(bannedMembers);
            }
        }, [room]);
        
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

        const handleUnban = (friendId: string) => {
            axios.post(`${import.meta.env.VITE_url_back}/api/room/unbanuser`,{id: friendId, name: room.name}, {withCredentials:true});
        
        }

        return (
            <AnimatePresence>

            <motion.div className="modal-backdrop"
                variants={backdrop}
                initial="hidden"
                animate="visible"
            >
                <motion.div className="modal-content-logs"
                variants={modal}>
                    <div className='banned-container'>
                    {
                        banned.length > 0 ? 
                        ( 
                            banned.map((friend) => (
                            <div className="banned-members" key={friend.id}>
                                        
                                <div className="amis-image">
                                    <img src={friend.avatar}/>
                                </div>
                        
                                <div className="amis-infos">
                                    <div className="amis-name"><p>{friend.login}</p></div>
                                </div>
                        
                                <div className="amis-status unblock" onClick={() => handleUnban(friend.id)}>Unban</div>
                        
                            </div>
                        ))
                        )
                        : 
                        (
                            <div className='no-logs'> NO LOGS</div>
                        )
                    }
                    </div>

                    <div className="butt-cancel-logs">
                        <div className="But-modal Cancel-But-logs"
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

export default LogsModal