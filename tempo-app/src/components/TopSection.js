import React from 'react'
import './TopSection.css'
import image from './images/running-sub.jpg'

const TopSection = () => {
    return (
        <div id="container">
            <div id="top-text-container">
                <h1 id="top-text">The soundtrack that keeps you motivated.</h1>
            </div>

            <div id="img-container">
                <img id="image" src={image} alt="runner" />
            </div>

            <div id="side-text-container">
                <h1 id="subtitle">OUR MISSION</h1>
                <p id="subtext">We know that you have big goals. We're here to make sure you reach those goals, by adding a personal touch.</p>
            </div>
        </div>
    );
}

export default TopSection