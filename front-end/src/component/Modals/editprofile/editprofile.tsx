
import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

import './editprofile.css';

interface User {
  id: string;
  login: string;
  avatar: string;
}

interface EditProfileProps {
  user: User;
  ShowEdit: boolean;
  Setedit: React.Dispatch<React.SetStateAction<boolean>>;
  onCancel: () => void;
  setErrorMessage:any;
}

function EditProfile({ user, ShowEdit, Setedit, onCancel ,setErrorMessage}: EditProfileProps) {
  if (!ShowEdit) {
    return null;
  }

  const backdrop = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modal = {
    hidden: {
      y: '-100vh',
      opacity: 0,
    },
    visible: {
      y: '200px',
      opacity: 1,
      transition: { delay: 0.5 },
    },
  };

  const [name, setName] = useState(user.login);
  const [image, setImage] = useState<File | string>(user.avatar);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>(user.avatar);


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
    
    const handleSubmit = async ( e: React.FormEvent) => {
        Setedit(false);
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('avatar', image); 
        try {
          await axios.post(`${import.meta.env.VITE_url_back}/api/auth/update_user`, formData, {
              withCredentials: true,
              headers: {
                  'Content-Type': 'multipart/form-data',
              },
          });
        }
        catch(error: any)
        {
          setErrorMessage('An error occurred: avatar to large');
          setTimeout(() => {
            setErrorMessage(''); 
          }, 1000);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          e.preventDefault(); 
          handleSubmit(e) ;
        }
      };
  
    return (
        <AnimatePresence>

        <motion.div className="modal-backdrop"
            variants={backdrop}
            initial="hidden"
            animate="visible"
        >
            <motion.div className="modal-content-settings"
            variants={modal}>
                <div className='New-infos'>
                        <p className='choosename'>choose a name</p>
                        <input type="text" placeholder='Enter a name' 
                            className='newname' 
                            maxLength={8} 
                            value={name} 
                            onChange={handleNameChange} 
                            onKeyDown={handleKeyDown}
                          />
                        <div className='maxlenght'>
                        {name.length === 8 && (
                            <p>Maximum length reached !</p>
                            )}
                        </div>
        
                        <p className='chooseimg'>choose an avatar</p>
                        <div className='avatarChose'>
                           
                            <input className='avatimg' type="file" onChange={handleImageChange}  onKeyDown={handleKeyDown} /> 
        

                            <img className='preview'  src={imagePreviewUrl} />
                        </div>
                   
                </div>

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
  export default EditProfile