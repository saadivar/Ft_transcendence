import { useEffect } from "react";
import { useNavigate } from "react-router-dom";



export default function OnAccept(){
    const navigate = useNavigate();
    useEffect(()=>{
        navigate("/onlineGame", { replace: true });
    } ,[])

    return(
        <>
        </>
    )
}