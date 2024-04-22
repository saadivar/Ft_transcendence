import React, { useEffect, useState, ChangeEvent, KeyboardEvent  } from "react";
import "./MenuBar.css";
import logo from "../../../assets/logoPIngpong.svg";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useSocket } from "../../Socket";
import { Prev } from "react-bootstrap/esm/PageItem";
import Popup from "../../Modals/popup/Popup";
interface ModalProps {
  onClose: () => void;
  isTwoFactorEnabled: boolean;
}


interface User {
  isTwoFactorAuthenticationEnabled: boolean;
  id : number
  avatar : string
  login : string

}
interface MenuBarProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<null>>;

}

function Modal({ onClose, isTwoFactorEnabled } : ModalProps) {

  const [Qr, SetQr] = useState(null);
  const [showQr, SetShowQr] = useState(false);
  const [code, setcode] = useState("");
  const [showDisable, SetDisable] = useState(false);
  const [codeDisable, SetcodeDisable] = useState("");
  const backdrop = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modal = {
    hidden: {
      y: "-100vh",
      opacity: 0,
    },
    visible: {
      y: "200px",
      opacity: 1,
      transition: { delay: 0.5 },
    },
  };
  const generateQrcode = async () => {
    const resp = await axios.get(
      `${import.meta.env.VITE_url_back}/api/2fa/generate`,
      { withCredentials: true, responseType: "blob" }
    );
    SetQr(resp.data);
    SetShowQr(true);
  };

  const Disable = async (codeDisable: string) => {
    if (codeDisable != "") {
      const resp = await axios.post(
        `${import.meta.env.VITE_url_back}/api/2fa/turn-off`,
        { twofa: codeDisable },
        { withCredentials: true }
      );
      if (resp.status === 200) {
        onClose();
        SetDisable(false);
      }
    }
  };

  const sendConde = async (code : string) => {
    if (code != "") {
      const resp = await axios.post(
        `${import.meta.env.VITE_url_back}/api/2fa/turn-on`,
        { twofa: code },
        { withCredentials: true }
      );
      if (resp.status === 200) {
        SetQr(null);
        onClose();
        SetShowQr(false);
      }
    }
  };
  const handleKeyDowndis = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      Disable(codeDisable);
    }
  };

  const handleKeyDownenable = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      sendConde(code);
    }
  };
  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        variants={backdrop}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="modal-content-twfa" variants={modal}>
          <span
            className="close"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            x
          </span>
          <h1>Two-Factor Authentication</h1>

          {isTwoFactorEnabled ? (
            <button
              className="enable"
              onClick={(e) => {
                e.stopPropagation();
                SetDisable(true);
              }}
            >
              Disable 2FA
            </button>
          ) : (
            <button
              className="enable"
              onClick={(e) => {
                e.stopPropagation();
                generateQrcode();
              }}
            >
              Enable 2FA{" "}
            </button>
          )}
          {showQr && Qr && (
            <>
              <div className="Qr">
                <img src={URL.createObjectURL(Qr)} alt="Binary PNG Image"></img>
              </div>

              <input
                className="input-code"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onChange={(e) => {
                  e.stopPropagation();
                  setcode(e.target.value);
                }}
                onKeyDown={handleKeyDownenable}
              />
              <button
                className="saveBut"
                onClick={(e) => {
                  e.stopPropagation();
                  sendConde(code);
                }}
              >
                Save
              </button>
            </>
          )}

          {showDisable && (
            <>
              <input
                className="input-code"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onChange={(e) => {
                  e.stopPropagation();
                  
                  SetcodeDisable(e.target.value);
                }}
                onKeyDown={handleKeyDowndis}
              />
              <button
                className="saveBut"
                onClick={(e) => {
                  e.stopPropagation(); // Stop event propagation
                  Disable(codeDisable);
                }}
              >
                Save
              </button>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

const MenuBar = ({ user, setUser } : MenuBarProps) => {
  const [Settings, SetSettings] = useState(false);
  const location = useLocation()

  const navigate = useNavigate()
  const handleModal = () => {
    SetSettings(!Settings);
  };
  
  const handlogOut = async () =>{
    await axios.get(`${import.meta.env.VITE_url_back}/api/auth/logout`, { withCredentials: true });
    setUser(null);
    navigate("/", { replace: true });

  }
const socket = useSocket()
  const [allnotifs, setallnotifs] = useState('');
  const [up, setUp] = useState(0)

  useEffect(()=>{
    socket?.on('notif',()=> {setUp((prevIsbool)=>prevIsbool + 1)})
  })
  if (location.pathname !== "/chat"){

    useEffect(() => {
      const fetchData = async () => {
        try {
            const resp = await axios.get(`${import.meta.env.VITE_url_back}/api/auth/numofnotif`, { withCredentials: true });
            const num = resp.data
            if(num > 9)
              setallnotifs('+9');
            else
              setallnotifs(num.toString());
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        };
        fetchData();
      }, [location.pathname, up]);
  }


  const goToprofile = () => {
    user && navigate(`/profile/${user.id}`, { state: { userData: user } });
  };


  return (
    <>
    { user && 
      <div className="menuB">
        <div className="Menu-container">

            <div className="icon-logo">
        
                <Link to="/Home">
                  <img src={logo} className="elem"/>
                </Link>
            </div>
         
      
              <div className="icon" onClick={goToprofile}>
            
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
                  className="ai ai-Person elem"
                >
                  <circle cx="12" cy="7" r="5" />
                  <path d="M17 14h.352a3 3 0 0 1 2.976 2.628l.391 3.124A2 2 0 0 1 18.734 22H5.266a2 2 0 0 1-1.985-2.248l.39-3.124A3 3 0 0 1 6.649 14H7" />
                </svg>
         
              </div>

              <div className="icon ">
                {allnotifs.length > 0 && allnotifs != '0' && <div className="allnotif">{allnotifs}</div>}
                <Link to="/chat">
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
                  className="ai ai-ChatBubble elem"
                >
                  <path d="M14 19c3.771 0 5.657 0 6.828-1.172C22 16.657 22 14.771 22 11c0-3.771 0-5.657-1.172-6.828C19.657 3 17.771 3 14 3h-4C6.229 3 4.343 3 3.172 4.172 2 5.343 2 7.229 2 11c0 3.771 0 5.657 1.172 6.828.653.654 1.528.943 2.828 1.07" />
                  <path d="M14 19c-1.236 0-2.598.5-3.841 1.145-1.998 1.037-2.997 1.556-3.489 1.225-.492-.33-.399-1.355-.212-3.404L6.5 17.5" />
                </svg>
                </Link>
              </div>

            <div className="icon" onClick={handleModal}>
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
                className="ai ai-Gear elem"
              >
                <path d="M14 3.269C14 2.568 13.432 2 12.731 2H11.27C10.568 2 10 2.568 10 3.269v0c0 .578-.396 1.074-.935 1.286-.085.034-.17.07-.253.106-.531.23-1.162.16-1.572-.249v0a1.269 1.269 0 0 0-1.794 0L4.412 5.446a1.269 1.269 0 0 0 0 1.794v0c.41.41.48 1.04.248 1.572a7.946 7.946 0 0 0-.105.253c-.212.539-.708.935-1.286.935v0C2.568 10 2 10.568 2 11.269v1.462C2 13.432 2.568 14 3.269 14v0c.578 0 1.074.396 1.286.935.034.085.07.17.105.253.231.531.161 1.162-.248 1.572v0a1.269 1.269 0 0 0 0 1.794l1.034 1.034a1.269 1.269 0 0 0 1.794 0v0c.41-.41 1.04-.48 1.572-.249.083.037.168.072.253.106.539.212.935.708.935 1.286v0c0 .701.568 1.269 1.269 1.269h1.462c.701 0 1.269-.568 1.269-1.269v0c0-.578.396-1.074.935-1.287.085-.033.17-.068.253-.104.531-.232 1.162-.161 1.571.248v0a1.269 1.269 0 0 0 1.795 0l1.034-1.034a1.269 1.269 0 0 0 0-1.794v0c-.41-.41-.48-1.04-.249-1.572.037-.083.072-.168.106-.253.212-.539.708-.935 1.286-.935v0c.701 0 1.269-.568 1.269-1.269V11.27c0-.701-.568-1.269-1.269-1.269v0c-.578 0-1.074-.396-1.287-.935a7.755 7.755 0 0 0-.105-.253c-.23-.531-.16-1.162.249-1.572v0a1.269 1.269 0 0 0 0-1.794l-1.034-1.034a1.269 1.269 0 0 0-1.794 0v0c-.41.41-1.04.48-1.572.249a7.913 7.913 0 0 0-.253-.106C14.396 4.343 14 3.847 14 3.27v0z" />
                <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
              </svg>
            </div>

            <div className="icon" onClick={handlogOut}>
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
                className="ai ai-SignOut elem"
              >
                <path d="M13 12h9m0 0l-3.333-4M22 12l-3.333 4" />
                <path d="M14 7V5.174a2 2 0 0 0-2.166-1.993l-8 .666A2 2 0 0 0 2 5.84v12.32a2 2 0 0 0 1.834 1.993l8 .667A2 2 0 0 0 14 18.826V17" />
              </svg>
            </div>

        </div>
      </div>
    }
      {Settings && user && (
        <Modal
          onClose={handleModal}
          isTwoFactorEnabled={user.isTwoFactorAuthenticationEnabled}
        ></Modal>
      )}
    </>
  );
};

export default MenuBar;
