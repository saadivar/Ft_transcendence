import '@fortawesome/fontawesome-free/css/all.min.css';
import  "./GameModes.css";
import { Link } from 'react-router-dom';
import { useState } from 'react';


const GameModes = ({SetgoGame}) => {



return (

    <div className='matches-list-container'>
        
        <div className='title-history'>
            <p>List Matches</p>
        </div>

        <div className="matches-list">
        <Link to={{ pathname: "/practice"}}>
            <div className='match' onClick={SetgoGame(true)}>
                <div className=" card"></div>
            </div>
        </Link>
        
        <Link to="/online">
            <div className='match' onClick={SetgoGame(true)}>
                <div className=" card"></div>
            </div>
        </Link>
        </div>
    </div>
  );
};


export default GameModes