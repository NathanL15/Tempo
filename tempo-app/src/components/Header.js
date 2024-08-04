import React from "react"
import bannerImg from "./images/runner-tinted.png"
import './Header.css'

const Header = () => {
    return (
        <div id="banner">
            <div id="title-container">
                <h1 id="title">TEMPO</h1>

                <div id="header-btn">Get Started</div>
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