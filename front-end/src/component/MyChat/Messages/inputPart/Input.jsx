import {React, useContext, useState, useEffect} from 'react'
import "./Input.css"

import { useSocket }  from "../../../Socket"

const Input = ({User, Profile, Room}) => {

    const [message, setMessage] = useState('');
    const socket =  useSocket();

    const sendMessage = () => {
       
        if (message.trim() !== '' ) {
            
            Profile && User && socket.emit('message', {from: Profile.login , fromid: Profile.id, to: User.id, content: message });
            // fromid:string; roomname: string; content: string 
            Profile && Room && socket.emit('roommessage', { fromid: Profile.id, roomname: Room.name , content: message });
            setMessage('');
        }
    }

    

  return (
    <div className="inputPart">
        <div className="inputPart__container">
            <input 
                className="inputPart__input " 
                placeholder="Type a message..."
                value={message}
                onChange={(e) =>setMessage(e.target.value)}
            />
            <button className="send-message-button" onClick={sendMessage}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-reactid="1036">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            </button>
        </div>  
    </div>

  )
}

export default Input