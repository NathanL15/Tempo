import React from "react"
import './Header.css'
import bannerImg from "./images/runner-title.jpg"

const Header = () => {
    return (
        <div id="banner">
            <div>
            <h1>TEMPO</h1>
            </div>
            
            <img id="titleImg" src={bannerImg} alt="runner" />
        </div>
    );
}

export default Header