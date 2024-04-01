import React, { useEffect, useState } from 'react'
import {motion, AnimatePresence} from 'framer-motion'

import "./LogsModal.css"

function LogsModal({show, Banned}) {
    if (!show) {
      return null;
    }

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
    
    return (
        <AnimatePresence>

        <motion.div className="modal-backdrop"
            variants={backdrop}
            initial="hidden"
            animate="visible"
        >
            <motion.div className="modal-content-add"
            variants={modal}>

            </motion.div>
        </motion.div>
      </AnimatePresence>

    );
  }
  export default LogsModal