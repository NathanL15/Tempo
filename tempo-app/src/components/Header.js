import React from "react"
import bannerImg from "./images/runner-tinted.png"
import './Header.css'

const Header = () => {
    const handleLogin = () => {
        window.location.href = 'http://localhost:3001/login';
    };
    return (
        <div id="banner">
            <div id="title-container">
                <h1 id="title">TEMPO</h1>

                <div><button id="header-btn" onClick={handleLogin}>Login with Spotify</button></div>
            </div>

            <div id="side-phrase">
                <div id="side-phrase-1">
                    <h1 class="slogan">Your <span class="standout">Stride.</span></h1>
                </div>

                <div id="side-phrase-2">
                    <h1 class="slogan">Your <span class="standout">Sound.</span></h1>
                </div>
            </div>

            <img id="titleImg" src={bannerImg} alt="runner" />
        </div>
    )
}

export default Header