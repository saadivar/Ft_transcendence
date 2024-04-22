import React, { useEffect, useState , KeyboardEvent } from 'react'
import {motion, AnimatePresence} from 'framer-motion'

import "./addfriend.css"
import { useSocket } from '../../Socket';
interface Friend {
    avatar: string;
    login: string;
    id: string;
  }
  
  interface FriendHelperProps {
    image: string;
    name: string;

    onFriendClick: (login: string) => void;
  }

const FriendHelper = ( { image, name ,  onFriendClick} : FriendHelperProps ) => {
  
    return (
      <div className='friend-helper' onClick={() => onFriendClick(name)}>
        <div className='profileImg-helper'>
          <img src={image} alt={name} />
        </div>
        <div className='friend-name-helper'>{name}</div>
      </div>
    );
}

interface AddFriendModalProps {
  
    friendName: string;
    setFriendName: React.Dispatch<React.SetStateAction<string>>;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    onCancel: () => void;
}

function AddFriendModal({  friendName, setFriendName, onSubmit, onCancel }:AddFriendModalProps) {


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
    const socket = useSocket()
    const [help, setHelp] = useState<Friend[] | null>(null);

    useEffect(() => {
        socket?.on("autocomplete", (payload) => {
            setHelp(payload.users);
            
        });

        return () => {
            socket?.off("autocomplete");
        };
    },[socket])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFriendName(e.target.value);
        socket?.emit('autocomplete', e.target.value)
        
    };

    const friendClick = (login : string)=>{
        setFriendName(login);
    }


    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            onSubmit(e);
        }
    };

    return (
        <AnimatePresence>

        <motion.div className="modal-backdrop-add"
            variants={backdrop}
            initial="hidden"
            animate="visible"
        >
            <motion.div className="modal-content-add"
            variants={modal}>
                <input
                    className="input-add-modal"
                    type="text"
                    value={friendName}
                    onChange={handleInputChange}
                    placeholder="Enter friend's name"
                    onKeyDown={handleKeyDown}
                />

                <div className='autoComplete'>
                    {help ? (
                    help.map((friend, index) => (
                    
                    <FriendHelper key={index} image={friend.avatar} name={friend.login}  onFriendClick={friendClick}/> ))
                    ) : ( <div className='suggestion'><p> No Suggestion </p></div>)}
                </div>

                <div className="butt-add-modal">
                    <div className="But-modal submit-But-modal"onClick={onSubmit}>
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

export default AddFriendModal