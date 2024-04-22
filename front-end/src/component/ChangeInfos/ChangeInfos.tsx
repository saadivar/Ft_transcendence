

import React, { useEffect, useState } from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import "./ChangeInfos.css"
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSocket } from '../Socket';

interface User {
    id: string;
    login: string;
    avatar: string;
    isNew : Boolean;
}

interface ChangeProfileprops {
    user: User ;
}

function ChangeProfile({ user } : ChangeProfileprops)
{
    const [change, Setchange]  = useState(false)
    const [name, setName] = useState(user.login);
    const [image, setImage] = useState<File | string>(user.avatar);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string>(user.avatar);
    const socket = useSocket()
    const navigate = useNavigate(); 
    if(!user.isNew)
        navigate("/Home", { replace: true });
    
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setImage(file);
            const reader = new FileReader();
            
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('avatar', image);
        
        try {
            const response = await axios.post(`${import.meta.env.VITE_url_back}/api/auth/update_user`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
          
    
            if (response.status === 200) {
                
                Setchange(true);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };
    
    useEffect(() => {
        if (change) {
            navigate("/Home", { replace: true });
            Setchange(false); 
        }
    }, [change, navigate]); 



    const handleCancel = (e: React.FormEvent) => {
        e.preventDefault();
        Setchange(true); 
    }
    useEffect(() => {
    
        return () => {
            socket?.emit('changeinfodone');
        };
    }, []);
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          e.preventDefault(); 
          handleSubmit(e) ;
        }
      };
    return (

        <motion.div className="modal-backdrop-change">
            <motion.div className="modal-content-settings-change">

                <div className='New-infos'>
                        <p className='choosename'>choose a name</p>
                        <input type="text" onKeyDown={handleKeyDown} placeholder='Enter a name' className='newname' maxLength={8} value={name} onChange={handleNameChange} />
                        <div className='maxlenght'>
                        {name.length === 8 && (
                            <p>Maximum length reached !</p>
                            )}
                        </div>
        
                        <p className='chooseimg'>choose an avatar</p>
                        <div className='avatarChose'>
                            <input className='avatimg' onKeyDown={handleKeyDown} type="file"  onChange={handleImageChange} /> 
                            <img className='preview'  src={imagePreviewUrl} />
                        </div>
                   
                </div>

                <div className="butt-add-modal">
                    <div className="But-modal submit-But-modal" onClick={handleSubmit}>
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
                    onClick={handleCancel}>
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
  

    );
}

export default ChangeProfile