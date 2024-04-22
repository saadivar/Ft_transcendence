import axios from 'axios';
import React from 'react'

import { useState , ChangeEvent, KeyboardEvent } from 'react';

import { useSocket } from '../../Socket';
import {motion, AnimatePresence} from 'framer-motion'
import "./SettingsRoom"

interface Room {
    id: string;
    type: 'public' | 'private' | 'protected';
    password: string;
    roomname: string;
    lastmessagecontent: string;
    name: string;
}
  
interface ASettingsRoomProps {
    setShowSettings: React.Dispatch<React.SetStateAction<boolean>>;
    room :Room
}
const SettingsRoom = ({setShowSettings, room} : ASettingsRoomProps) => {
   

  
    const socket = useSocket();
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const [roomPassword, setRoomPassword] = useState(room.password);
    const [roomType, setRoomType] = useState<'public' | 'private' | 'protected'>(room.type);  
    const [RoomName, setRoomName] = useState(room.name);
    
    const handleRoomCreat = async (e: React.FormEvent) => {
        e.preventDefault();
        await axios.post(`${import.meta.env.VITE_url_back}/api/room/updateroom`, {id:room.id , roomname: RoomName ,type : roomType, password : roomPassword}, {withCredentials:true});
        socket?.emit('newroom')
        setShowSettings(false);
        setRoomName("");
    };

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

    const handleRoomTypeChange = (type: 'public' | 'private' | 'protected') => {
        setRoomType(type);
        setShowPasswordInput(type === 'protected');

    }
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          e.preventDefault(); 
          handleRoomCreat(e) ;
        }
      };
    return (

    <AnimatePresence>

        <motion.div className="modal-backdrop"
            variants={backdrop}
            initial="hidden"
            animate="visible"
        >
            <motion.div className="modal-content-room"
                variants={modal}>
                <input
                    className="room-input"
                    type="text"
                    value={RoomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Enter Room's name"
                    onKeyDown={handleKeyDown}
                />

                <div className="room-types">
                    <label className="room-type-option">
                        <input
                        type="radio"
                        name="roomType"
                        value="public"
                        checked={roomType === "public"}
                        onChange={() => handleRoomTypeChange('public')}
                        onKeyDown={handleKeyDown}
                        />
                        <span className="custom-radio"></span>
                        Public
                    </label>

                    <label className="room-type-option">
                        <input
                        onKeyDown={handleKeyDown}
                        type="radio"
                        name="roomType"
                        value="private"
                        checked={roomType === "private"}
                        onChange={() => handleRoomTypeChange('private')}
                        />
                        <span className="custom-radio"></span>
                        Private
                    </label>

                    <label className="room-type-option">
                        <input
                        type="radio"
                        name="roomType"
                        value="protected"
                        onKeyDown={handleKeyDown}
                        checked={roomType === "protected"}
                        onChange={() => handleRoomTypeChange('protected')}
                        />
                        <span className="custom-radio"></span>
                        Protected
                    </label>
                </div>

                {showPasswordInput && (
                    <input
                    onKeyDown={handleKeyDown}
                    className="password-input"
                    type="password"
                    value={roomPassword}
                    onChange={(e) => setRoomPassword(e.target.value)}
                    placeholder="Enter room password"
                    />
                )}

                <div className="butt-room-modal">

                    <div className="But-modalroom submit-But-modalroom" onClick={handleRoomCreat}>
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

                    <div className="But-modalroom Cancel-But-modalroom"
                    onClick={() => setShowSettings(false)}>
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
  )
}

export default SettingsRoom