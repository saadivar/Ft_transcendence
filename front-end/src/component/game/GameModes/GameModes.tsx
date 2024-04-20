import '@fortawesome/fontawesome-free/css/all.min.css';
import  "./GameModes.css";
import { Link } from 'react-router-dom';
import { useState } from 'react';


const GameModes = ({SetgoGame}) => {



return (

    <div className='modes-list-container'>
        
        <div className='title-history'>
            <p>Game Modes</p>
        </div>

        <div className="mode-list">

                <div className='mode' onClick={SetgoGame(true)}>
                    <Link to={{ pathname: "/practice"}}>
                        <div className="card-mode"><p>PLAY VS BOOT</p></div>
                    </Link>
                </div>
            
                <div className='mode' onClick={SetgoGame(true)}>
                    <Link to="/online">
                        <div className="card-mode"><p>PLAY VS USER</p></div>
                    </Link>
                </div>
        
            <div className='mode' onClick={SetgoGame(true)}>
                <div className="card-mode"></div>
            </div>

        </div>
    </div>
  );
};


export default GameModes