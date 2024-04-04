import React, { useEffect, useState } from "react";
import "./MenuBar.css";
import logo from"../../../assets/logoPIngpong.svg"
import { Link } from 'react-router-dom';
import {motion, AnimatePresence} from 'framer-motion'
import axios from "axios";



function Modal({ onClose  , isTwoFactorEnabled}) {

  const [Qr, SetQr] = useState(null);
  const [showQr, SetShowQr] = useState(false);
  const [code , setcode] = useState('')
  const [showDisable, SetDisable] = useState(false);
  const [codeDisable, SetcodeDisable] = useState('');
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
  const generateQrcode =  async () => {
    const resp = await axios.get(`${import.meta.env.VITE_url_back}/api/2fa/generate`, {withCredentials: true, responseType: 'blob'})
    SetQr(resp.data)
    SetShowQr(true);
  }
      
  
  const Disable = async (codeDisable)=> {

    if (codeDisable != '') {
      const resp =  await axios.post(`${import.meta.env.VITE_url_back}/api/2fa/turn-off`, {twofa: codeDisable}, {withCredentials: true});
      if (resp.status === 200) {
        onClose(false);
        SetDisable(false);
      }
    }

  }
    


  const sendConde = async (code) =>
  {
    if(code != ''){
      const resp =  await axios.post(`${import.meta.env.VITE_url_back}/api/2fa/turn-on`, {twofa:code},{withCredentials: true});
      if (resp.status === 200){
        SetQr(null);
        onClose(false);
        SetShowQr(false);
      }
    }
  }

  return (
    <AnimatePresence>
      <motion.div className="modal-backdrop"
          variants={backdrop}
          initial="hidden"
          animate="visible" >
        <motion.div className="modal-content-twfa"
        variants={modal}>

          <span className="close" onClick={(e) => { e.stopPropagation(); onClose() }}>x</span>
          <h1>Two-Factor Authentication</h1>

          {
            isTwoFactorEnabled ? (
                <button className="enable" onClick={(e) => { e.stopPropagation(); SetDisable(true)}}>
                Disable 2FA
                </button>
            ) : (
              <button className="enable" onClick={(e) => { e.stopPropagation(); generateQrcode() }}>
                Enable 2FA </button>
            )
          }
          {
            showQr && Qr && (
              <>
                  <div className="Qr">
                    <img  src={URL.createObjectURL(Qr)} alt="Binary PNG Image"></img>
                  </div>
                
                  <input
                    className="input-code"
                    onClick={(e) => { e.stopPropagation(); }}
                    onChange={(e) => { e.stopPropagation(); 
                      setcode(e.target.value);
                    }}
                  />
                  <button
                    className="saveBut"
                    onClick={(e) => { e.stopPropagation(); // Stop event propagation
                      sendConde(code);
                    }}>
                    Save
                  </button>
              </>
            )
          }

          {
            showDisable  && (
              <>
                <input
                    className="input-code"
                    onClick={(e) => { e.stopPropagation(); }}
                    onChange={(e) => { e.stopPropagation(); 
                      SetcodeDisable(e.target.value);
                    }}/>
                  <button
                    className="saveBut"
                    onClick={(e) => { e.stopPropagation(); // Stop event propagation
                    Disable(codeDisable);
                    }}>
                    Save
                  </button>
              </>
            )
          }
      </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

const MenuBar = ({user}) => {

  const [Settings, SetSettings] = useState(false);
  
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] =  user && useState(user.isTwoFactorAuthenticationEnabled);


  const handleModal = () =>
  {
    SetSettings(!Settings);
  }

  return (
    <>
      <div className="menuB">
        <div className="Menu-container">
          
            <div className="logo"><img src={logo}/></div>

            <div className="icons-cont">
              <Link to="/Home">

              <div className="icon  icon-profile">
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
                  class="ai ai-Person"
                >
                  <circle cx="12" cy="7" r="5" />
                  <path d="M17 14h.352a3 3 0 0 1 2.976 2.628l.391 3.124A2 2 0 0 1 18.734 22H5.266a2 2 0 0 1-1.985-2.248l.39-3.124A3 3 0 0 1 6.649 14H7" />
                </svg>
              </div>
              
              </Link>

              <Link to="/Game">
                <div className="icon  icon-game">
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
                    class="ai ai-GameController"
                  >
                    <path d="M9 15l-2.968 2.968A2.362 2.362 0 0 1 2 16.298V15l1.357-6.784A4 4 0 0 1 7.279 5h9.442a4 4 0 0 1 3.922 3.216L22 15v1.297a2.362 2.362 0 0 1-4.032 1.67L15 15H9z" />
                    <path d="M9 5l1 2h4l1-2" />
                  </svg>
                </div>
              </Link>

              <Link to="/chat">
                <div className="icon  icon-chat">
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
                    class="ai ai-ChatBubble"
                  >
                    <path d="M14 19c3.771 0 5.657 0 6.828-1.172C22 16.657 22 14.771 22 11c0-3.771 0-5.657-1.172-6.828C19.657 3 17.771 3 14 3h-4C6.229 3 4.343 3 3.172 4.172 2 5.343 2 7.229 2 11c0 3.771 0 5.657 1.172 6.828.653.654 1.528.943 2.828 1.07" />
                    <path d="M14 19c-1.236 0-2.598.5-3.841 1.145-1.998 1.037-2.997 1.556-3.489 1.225-.492-.33-.399-1.355-.212-3.404L6.5 17.5" />
                  </svg>
                </div>
              </Link>

              <div className="icon  con-notifs" >
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
                  class="ai ai-Bell"
                  >
                  <path d="M12.721 5.003L11.255 5c-3.344-.008-6.247 2.709-6.27 6v3.79c0 .79-.1 1.561-.531 2.218l-.287.438C3.73 18.11 4.2 19 4.985 19h14.03c.785 0 1.254-.89.818-1.554l-.287-.438c-.43-.657-.531-1.429-.531-2.219v-3.788c-.04-3.292-2.95-5.99-6.294-5.998z" />
                  <path d="M15 19a3 3 0 1 1-6 0" />
                  <path d="M12 2a2 2 0 0 1 2 2v1h-4V4a2 2 0 0 1 2-2z" />
                </svg>
                
              </div>

              <div className="icon  icon-settings" onClick={handleModal}>
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
                  class="ai ai-Gear"
                >
                  <path d="M14 3.269C14 2.568 13.432 2 12.731 2H11.27C10.568 2 10 2.568 10 3.269v0c0 .578-.396 1.074-.935 1.286-.085.034-.17.07-.253.106-.531.23-1.162.16-1.572-.249v0a1.269 1.269 0 0 0-1.794 0L4.412 5.446a1.269 1.269 0 0 0 0 1.794v0c.41.41.48 1.04.248 1.572a7.946 7.946 0 0 0-.105.253c-.212.539-.708.935-1.286.935v0C2.568 10 2 10.568 2 11.269v1.462C2 13.432 2.568 14 3.269 14v0c.578 0 1.074.396 1.286.935.034.085.07.17.105.253.231.531.161 1.162-.248 1.572v0a1.269 1.269 0 0 0 0 1.794l1.034 1.034a1.269 1.269 0 0 0 1.794 0v0c.41-.41 1.04-.48 1.572-.249.083.037.168.072.253.106.539.212.935.708.935 1.286v0c0 .701.568 1.269 1.269 1.269h1.462c.701 0 1.269-.568 1.269-1.269v0c0-.578.396-1.074.935-1.287.085-.033.17-.068.253-.104.531-.232 1.162-.161 1.571.248v0a1.269 1.269 0 0 0 1.795 0l1.034-1.034a1.269 1.269 0 0 0 0-1.794v0c-.41-.41-.48-1.04-.249-1.572.037-.083.072-.168.106-.253.212-.539.708-.935 1.286-.935v0c.701 0 1.269-.568 1.269-1.269V11.27c0-.701-.568-1.269-1.269-1.269v0c-.578 0-1.074-.396-1.287-.935a7.755 7.755 0 0 0-.105-.253c-.23-.531-.16-1.162.249-1.572v0a1.269 1.269 0 0 0 0-1.794l-1.034-1.034a1.269 1.269 0 0 0-1.794 0v0c-.41.41-1.04.48-1.572.249a7.913 7.913 0 0 0-.253-.106C14.396 4.343 14 3.847 14 3.27v0z" />
                  <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
                </svg>
                
              </div>
            </div>

        </div>
        {/* </div> */}
      </div>
      {Settings && <Modal 
        onClose={handleModal} 
        isTwoFactorEnabled={isTwoFactorEnabled}
      ></Modal>}
    </>

  );
};

            
export default MenuBar;
