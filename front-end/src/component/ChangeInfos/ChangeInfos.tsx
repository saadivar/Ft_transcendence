

import React, { useEffect, useState } from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import "./ChangeInfos.css"
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSocket } from '../Socket';

function ChangeProfile({ user })
{
    const [change, Setchange]  = useState(false)
    const navigate = useNavigate(); 
    const [name, setName] = useState(user.login);
    const [image, setImage] = useState(user.avatar);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(user.avatar);
    const socket = useSocket()
    if(!user.isNew)
        navigate("/Home", { replace: true });
    
    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        setImage(file);
        const reader = new FileReader();
        
        reader.onloadend = () => {
            setImagePreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
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
            console.log("resp = ", response); 
    
            if (response.status === 200) {
                console.log("here llll");
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



    const handleCancel = (e) => {
        e.preventDefault();
        Setchange(true); 
    }
    useEffect(() => {
    
        return () => {
            socket?.emit('changeinfodone');
        };
    }, []);
    return (

        <motion.div className="modal-backdrop-change">
            <motion.div className="modal-content-settings-change">

                <div className='New-infos'>
                        <p className='choosename'>choose a name</p>
                        <input type="text" placeholder='Enter a name' className='newname' maxLength={8} value={name} onChange={handleNameChange} />
                
        
                        <p className='chooseimg'>choose an avatar</p>
                        <div className='avatarChose'>
                            <input className='avatimg' type="file" onChange={handleImageChange} /> 
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
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="ai ai-Check"
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
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="ai ai-Cross"
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