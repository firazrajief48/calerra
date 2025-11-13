import React, { useState, useEffect } from 'react';
import { IoSunnyOutline } from "react-icons/io5";
import { IoMoonOutline } from "react-icons/io5";
import "./Darkmode.css";

function Darkmode() {
    const [mode, setMode] = useState("darkmode");

    function toggle() {
        if (mode=="darkmode") {
            setMode("lightmode")
        } else {
            setMode("darkmode")
        }
    }

    useEffect(()=>{
        document.body.className=mode
    }, [mode])
    return (
        <button className="darkmodebtn" onClick={()=>{
            toggle()
            console.log(mode);
        }}>{mode==="darkmode"?<IoSunnyOutline/>:<IoMoonOutline />}</button>
    )
}

export default Darkmode