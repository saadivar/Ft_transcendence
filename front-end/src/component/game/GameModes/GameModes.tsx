import '@fortawesome/fontawesome-free/css/all.min.css';
import  "./GameModes.css";
import { Link } from 'react-router-dom';


const GameModes = ({SetgoGame} : any) => {



    return (

        <div className='modes-list-container'>
            
            <div className='title-mode'>
                <p>Game Modes</p>
            </div>
    
            <div className="mode-list">
    
                    <div className='mode bot' onClick={() => {SetgoGame(true)}}>
                        <Link  className='linkstyling' to={{ pathname: "/practice"}}>
                            <div className="card-mode"></div>
                        </Link>
                    </div>
                
                    <div className='mode player' onClick={() => {SetgoGame(true)}}>
                        <Link to="/online" className='linkstyling'>
                            <div className="card-mode"></div>
                        </Link>
                    </div>
            </div>
        </div>
      );
    };


export default GameModes