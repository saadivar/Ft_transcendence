import React from 'react';
import "./Punk.css";
import MenuBar from "./MenuBar/MenuBar";

import Friends from "./friends/friend"
import Infos from "./Infos/infos"
import GameModes from "../game/GameModes/GameModes"



import { useSocket }  from "../../component/Socket"




const Punk = ({user, SetgoGame}) => {
  const socket = useSocket();

  
  return (
    <div className='profile'>

        <div className='page'>
          

            <Infos user={user}/>

        
            <Friends />
          

            <GameModes SetgoGame={SetgoGame}/>


        </div>
      {
        user &&  <MenuBar user={user}/>
      }
    </div>
  )
}

export default Punk