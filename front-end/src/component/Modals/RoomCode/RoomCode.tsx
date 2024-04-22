import React, { useEffect, useState,KeyboardEvent } from 'react'
import {motion, AnimatePresence} from 'framer-motion'

import "./RoomCode.css"
interface CodeModalProps {
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    onSubmit: (e: any) => Promise<void>;
    onCancel: () => void;
}
function CodeModal({password, setPassword, onSubmit, onCancel }: CodeModalProps) {

    const backdrop = {
        visible : {opacity: 1},
        hidden: {opacity: 0}
    }

    const modal = {
        hidden : {
            y :"-100vh",
            opacity: 0 
        },
        visible: {
            y : "200px",
            opacity: 1,
            transition : {delay: 0.5}
        }
    }
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          e.preventDefault(); 
          onSubmit(e) ;
        }
      };
    return (
        <AnimatePresence>

        <motion.div className="modal-backdrop"
            variants={backdrop}
            initial="hidden"
            animate="visible"
        >
            <motion.div className="modal-content-code"
            variants={modal}>
                <input
                    className="input-code-modal"
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Room Code"
                    onKeyDown={handleKeyDown}
                />
                <div className="butt-code-modal">
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
  export default CodeModal